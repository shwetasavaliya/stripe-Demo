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
import PaymentService from "../payment_master/payment.service";
import BalanceHistoryService from "../sallerBalanceHistory/sallerBalanceHistory.service";
import { STRIPE_SECRET_KEY } from "../../config";
import { WEBHOOK_TRANSFER_SECRET_KEY } from "../../config";
const stripe = require("stripe")(STRIPE_SECRET_KEY);

@JsonController("/transferWebhook")
export default class TransferWebhookController {
  private paymentService: PaymentService = new PaymentService();
  private balanceHistoryService: BalanceHistoryService =
    new BalanceHistoryService();

  @Post("/create-transfer", { transformResponse: true })
  async create(@Req() request: any, @Res() response: any) {
    try {
      if (WEBHOOK_TRANSFER_SECRET_KEY) {
        let signature = request.headers["stripe-signature"];
        let stripeWebhook;
        try {
          stripeWebhook = stripe.webhooks.constructEvent(
            request.body,
            signature,
            WEBHOOK_TRANSFER_SECRET_KEY
          );
        } catch (err) {
          console.log("Webhook signature verification failed", err);
          return response.formatter.error(
            {},
            false,
            "Webhook signature verification failed"
          );
        }
        let data = stripeWebhook.data || {};
        let eventType = stripeWebhook.type || "none";
        switch (eventType) {
          case "transfer.created":
            {
              var { object: transfer } = data;
              if (transfer) {
                let { sellerId } = transfer.metadata || {};
                await this.paymentService.updateMany(
                  {
                    userId: sellerId,
                    payment_type: "transfer",
                  },
                  { paymentStatus: "successed" }
                );
                const balaceData = await this.balanceHistoryService.findOne(
                  {
                    sellerId: sellerId,
                  },
                  { sort: { createdAt: -1 } }
                );
                let openingBal: any = 0;
                let closingBal = transfer?.amount;
                let transferAmt = transfer?.amount;
                if (transfer?.currency?.toLowerCase() === "usd") {
                  (openingBal /= 100),
                    (closingBal /= 100),
                    (transferAmt /= 100);
                }
                if (balaceData) {
                  openingBal = balaceData.closingBalance;
                  closingBal += balaceData.closingBalance;
                }
                var balanceObj: any = {
                  sellerId: sellerId,
                  openingBalance: openingBal || 0,
                  closingBalance: closingBal || 0,
                  transactionAmount: transferAmt || 0,
                  currency: transfer?.currency,
                  transactionType: "credit",
                  paymentInfo: transfer || {},
                };
                await this.balanceHistoryService.create(balanceObj);
              }
            }
            break;

          case "transfer.failed":
            {
              var { object: transfer } = data;
              if (transfer) {
                let { sellerId } = transfer.metadata || {};

                await this.paymentService.updateOne(
                  {
                    userId: sellerId,
                    payment_type: "transfer",
                  },
                  { paymentStatus: "failed" }
                );
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
