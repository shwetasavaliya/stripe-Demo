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
import { Auth } from "../../middleware/auth";
import UserService from "../user/user.service";
import { STRIPE_SECRET_KEY } from "../../config";
const stripe = require("stripe")(STRIPE_SECRET_KEY);
const moment = require("moment");
const time = moment.utc().valueOf();

@JsonController("/payment")
@UseBefore(Auth)
export default class PaymentController {
  private userService: UserService = new UserService();

  @Get("/verify-link", { transformResponse: true })
  async register(@Req() request: any, @Res() response: any) {
    try {
      const userInfo: any = await this.userService.findOne({
        _id: request.data.id,
      });
      let stpAccountId = userInfo?.stp_account_id || null;
      if (!stpAccountId) {
        const account = await stripe.accounts.create({
          type: "custom",
          country: "US",
          email: userInfo.email,
          business_type: "individual",
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
          },
          business_profile: {
            mcc: 5661,
            url: "www.google.com",
          },
          settings: {
            payouts: {
              schedule: {
                interval: "manual",
              },
            },
          },
          tos_acceptance: {
            date: Math.floor(time / 1000),
            ip: "127.0.0.1",
          },
        });
        stpAccountId = account.id;
      }
      const update: any = {
        stp_account_id: stpAccountId,
        stp_account_status: "pending",
      };

      await this.userService.update({ _id: request.data.id }, { $set: update });

      const accountLink = await stripe.accountLinks.create({
        account: stpAccountId,
        refresh_url: "https://example.com/success",
        return_url: "https://example.com/success",
        type: "account_onboarding",
      });

      return response.formatter.ok({ accountLink }, true, "GET_VERIFY_LINK");
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error(
        {},
        false,
        "GET_VERIFY_LINK_FAILED",
        error
      );
    }
  }
}
