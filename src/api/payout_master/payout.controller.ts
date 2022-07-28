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
import PayoutService from "./payout.service";
import BankService from "../bankMaster/bank.service";
import UserService from "../user/user.service";
import { STRIPE_SECRET_KEY } from "../../config";
import { payoutDTO } from "./payout.validator";
import { Auth } from "../../middleware/auth";
const stripe = require("stripe")(STRIPE_SECRET_KEY);

@JsonController("/payout")
@UseBefore(Auth)
export default class PayoutController {
  private payoutService: PayoutService = new PayoutService();
  private userService: UserService = new UserService();
  private bankService: BankService = new BankService();
  @Post("/payout-transfer", { transformResponse: true })
  async productCreate(
    @Req() request: any,
    @Res() response: any,
    @Body({ validate: true }) body: payoutDTO
  ) {
    try {
      let { paymentAmount, bank_account } = body;

      const userData: any = await this.userService.findOne({
        _id: request.data.id,
      });

      if (!userData) {
        return response.formatter.error(false, "SELLER_NOT_FOUND");
      }

      const stpAccountId = userData.stp_account_id;
      if (userData.stp_account_status !== "verified") {
        return response.formatter.error(false, "PLEASE_VERIFIED_BANK_ACCOUNT");
      }
      let acc: any;
      if (!bank_account) {
        const resultBankAccounts: any = await this.bankService.findOne({
          sellerId: request.data.id,
          is_deleted: false,
        });
        bank_account = resultBankAccounts.stripeBankAccountId;
      }
      if (!bank_account)
        return response.formatter.error(false, "BANK_ACCOUNT_NOT_FOUND");

      const payout = await stripe.payouts.create(
        {
          amount: paymentAmount * 100,
          currency: "usd",
          destination: bank_account,
          metadata: {
            sellerId: request.data.id,
          },
        },
        { stripeAccount: stpAccountId }
      );

      const payoutObj: any = {
        sellerId: request.data.id,
        stripePayoutId: payout.id,
        destinationId: payout.destination,
        paymentAmount: payout.amount / 100,
        currency: payout.currency,
        arrival_date: payout.arrival_date,
        stripe_status: payout.status,
      };

      return response.formatter.ok(true, "PAYOUT_CREATE_SUCESSFULLY");
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error({}, false, "PAYOUT_CREATE_FAILED", error);
    }
  }
}
