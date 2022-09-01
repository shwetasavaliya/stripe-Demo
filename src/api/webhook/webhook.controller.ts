import {
  Body,
  Get,
  JsonController,
  Post,
  Put,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import UserService from "../user/user.service";
import PayoutService from "../payout_master/payout.service";
import BalanceHistoryService from "../sallerBalanceHistory/sallerBalanceHistory.service";
import { STRIPE_SECRET_KEY } from "../../config";
import { STRIPE_WEBHOOK_SECRET_KEY } from "../../config";
import moment, { unix } from "moment";
const dateFomate = "YYYY-MM-DD HH:mm:ss";
const stripe = require("stripe")(STRIPE_SECRET_KEY);

@JsonController("/webhook")
export default class WebhookController {
  private userService: UserService = new UserService();
  private payoutService: PayoutService = new PayoutService();
  private balanceHistoryService: BalanceHistoryService =
    new BalanceHistoryService();

  @Post("/create-account1", { transformResponse: true })
  async create(@Req() request: any, @Res() response: any) {
    try {
      if (STRIPE_WEBHOOK_SECRET_KEY) {
        let signature = request.headers["stripe-signature"];
        let stripeWebhook;
        try {
          stripeWebhook = stripe.webhooks.constructEvent(
            request.body,
            signature,
            STRIPE_WEBHOOK_SECRET_KEY
          );
        } catch (err) {
          console.log("Webhook signature verification failed");
          return response.formatter.error(
            {},
            false,
            "Webhook signature verification failed"
          );
        }
        let data = stripeWebhook.data || {};
        let eventType = stripeWebhook.type || "none";

        switch (eventType) {
          case "account.updated":
            {
              var { object: account } = data;
              if (account) {
                var stripeAccountId = account?.id || null;
              }
              var resultUser = await this.userService.findOne({
                stp_account_id: stripeAccountId,
                is_deleted: 0,
              });
              if (!resultUser) {
                return response.formatter.error(
                  {},
                  false,
                  "NO_USER_ACCOUNT_FIND"
                );
              }

              if (resultUser.stp_account_status !== "verified") {
                var { charges_enabled, payouts_enabled, requirements } =
                  account || {};
                if (
                  charges_enabled &&
                  payouts_enabled &&
                  requirements.currently_due.length === 0 &&
                  requirements.errors.length === 0 &&
                  requirements.eventually_due.length === 0 &&
                  requirements.pending_verification.length === 0
                ) {
                  var userId = resultUser._id;
                  var update: any = {
                    stp_account_status: "verified",
                  };
                  await this.userService.update(
                    { _id: userId },
                    { $set: update }
                  );
                  return response.formatter.ok(
                    true,
                    "ACCOUNT_CONFIRMED_SUCCESSFULLY"
                  );
                } else if (
                  requirements.errors.length === 0 &&
                  requirements.pending_verification.length === 0 &&
                  requirements.eventually_due.length === 1 &&
                  requirements.eventually_due[0] === "external_account"
                ) {
                  var update: any = {
                    stp_account_status: "bank_account_pending",
                  };
                  await this.userService.update(
                    { _id: userId },
                    { $set: update }
                  );
                  return response.formatter.ok(
                    true,
                    "BANK_ACCOUNT_NEEDS_TO_BE_ATTACH!"
                  );
                } else if (requirements.pending_verification.length > 0) {
                  var update: any = {
                    stp_account_status: "pending_verification",
                  };
                  await this.userService.update(
                    { _id: userId },
                    { $set: update }
                  );
                  return response.formatter.ok(
                    true,
                    "BANK_ACCOUNT_NEEDS_TO_BE_ATTACH!"
                  );
                } else if (
                  requirements.currently_due.length > 0 ||
                  requirements.errors.length > 0
                ) {
                  var update: any = {
                    stp_account_status: "currently_due",
                  };
                  await this.userService.update(
                    { _id: userId },
                    { $set: update }
                  );
                  return response.formatter.ok(
                    true,
                    "DOCUMENT_VERIFICATION_REQUIRED!"
                  );
                } else {
                  var update: any = {
                    stp_account_status: "pending",
                  };
                  await this.userService.update(
                    { _id: userId },
                    { $set: update }
                  );
                }
              }
            }
            break;

          case "payout.created":
            {
              var { object: payout } = data;
              let payAmount = payout?.amount || 0;
              let currency = payout?.currency || "usd";
              if (payout) {
                let { sellerId } = payout.metadata || {};
                let arrival_date = moment
                  .unix(payout.arrival_date)
                  .format(dateFomate);

                const payoutObj: any = {
                  sellerId: sellerId,
                  stripePayoutId: payout.id,
                  destinationId: payout.destination,
                  paymentAmount: payAmount / 100,
                  currency: currency,
                  arrival_date: arrival_date,
                  stripe_status: payout.status,
                };
                await this.payoutService.create(payoutObj);
                return response.formatter.ok(
                  true,
                  "PAYOUT_CREATED_SUCCESSFULLY"
                );
              }
            }
            break;

          case "payout.updated":
            {
              var { object: payout } = data;
              if (payout) {
                var updateObj: any = {
                  arrival_date: moment
                    .unix(payout.arrival_date)
                    .format(dateFomate),
                  stripe_status: payout.status,
                };
                await this.payoutService.updateOne(
                  { stripePayoutId: payout.id },
                  { $set: updateObj }
                );
                return response.formatter.ok(
                  true,
                  "PAYOUT_UPDATED_SUCCESSFULLY"
                );
              }
            }
            break;

          case "payout.failed":
            {
              var { object: payout } = data;
              if (payout) {
                var updateObj: any = {
                  stripe_status: payout.status,
                };
                await this.payoutService.updateOne(
                  { stripePayoutId: payout.id },
                  { $set: updateObj }
                );
                return response.formatter.ok(
                  true,
                  "PAYOUT_FAILED_SUCCESSFULLY"
                );
              }
            }
            break;

          case "payout.paid":
            {
              var { object: payout } = data;
              if (payout) {
                let { sellerId } = payout.metadata || {};

                var updateObj: any = {
                  arrival_date: moment
                    .unix(payout.arrival_date)
                    .format(dateFomate),
                  stripe_status: payout.status,
                };
                await this.payoutService.updateOne(
                  { stripePayoutId: payout.id },
                  { $set: updateObj }
                );
                const balaceData: any =
                  await this.balanceHistoryService.findOne({
                    sellerId: sellerId,
                  });
                let openingBal: any = 0;
                let closingBal = payout?.amount;
                let transferAmt = payout?.amount;
                if (payout?.currency?.toLowerCase() === "usd") {
                  (openingBal /= 100),
                    (closingBal /= 100),
                    (transferAmt /= 100);
                }
                if (!!balaceData) {
                  openingBal = balaceData.closingBalance;
                  closingBal -= balaceData.closingBalance;
                }
                var balanceObj: any = {
                  sellerId: sellerId,
                  openingBalance: openingBal || 0,
                  closingBalance: closingBal || 0,
                  transactionAmount: transferAmt || 0,
                  currency: payout?.currency,
                  transactionType: "debit",
                  paymentInfo: payout || {},
                };
                await this.balanceHistoryService.create(balanceObj);
                return response.formatter.ok(true, "PAYOUT_PAID_SUCCESSFULLY");
              }
            }
            break;
          default:
            // Unexpected event type
            console.log(`Unhandled event type ${eventType}.`);
        }
      }

      return response.formatter.ok(true, "WEBHOOK_CONNECT_SUCCESS");
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error(
        {},
        false,
        "WEBHOOK_CONNECT_FAILED",
        error
      );
    }
  }
}
