import {
  Body,
  Delete,
  Get,
  JsonController,
  Post,
  Put,
  Req,
  Res,
  UseBefore,
} from "routing-controllers";
import BankService from "./bank.service";
import UserService from "../user/user.service";
import { BankDTO, bankDTO } from "./bank.validator";
import { Auth } from "../../middleware/auth";
import { STRIPE_SECRET_KEY } from "../../config";
const stripe = require("stripe")(STRIPE_SECRET_KEY);
const moment = require("moment");
const time = moment.utc().valueOf();

@JsonController("/bank")
@UseBefore(Auth)
export default class CardController {
  private bankService: BankService = new BankService();
  private userService: UserService = new UserService();

  @Post("/create", { transformResponse: true })
  async cardCreate(
    @Req() request: any,
    @Res() response: any,
    @Body({ validate: true }) body: BankDTO
  ) {
    try {
      const {
        accountHolderName,
        accountHolderType,
        routingNumber,
        accountNumber,
      } = body;

      const userInfo = await this.userService.findOne({ _id: request.data.id });
      if (!userInfo)
        return response.formatter.error({}, false, "USER_DOES_NOT_EXISTS");

      let stripeCustId = userInfo?.stp_account_id || null;
      if (!stripeCustId) {
        var sourceIp = request.ip;
        const account = await stripe.accounts.create({
          type: "custom",
          country: "US",
          email: userInfo.email,
          capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
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
            ip: sourceIp,
          },
        });
        stripeCustId = account.id;
      }
      const update: any = {
        stp_account_id: stripeCustId,
        stp_account_status: "pending",
      };
      await this.userService.update({ _id: request.data.id }, { $set: update });
      const token = await stripe.tokens.create({
        bank_account: {
          country: "US",
          currency: "usd",
          account_holder_name: accountHolderName,
          account_holder_type: accountHolderType,
          routing_number: routingNumber,
          account_number: accountNumber,
        },
      });

      const getBankAccounts = await this.bankService.find({
        sellerId: request.data.id,
        is_deleted: false,
      });

      const getBankAccount = getBankAccounts.find(
        (data: any) => data.fingerprint === token.bank_account.fingerprint
      );

      if (getBankAccount) {
        return response.formatter.error(
          {},
          false,
          "BANK_ACCOUNT_ALREADY_EXIST"
        );
      }

      const bankAccount = await stripe.accounts.createExternalAccount(
        stripeCustId,
        {
          external_account: token.id,
        }
      );
      const bankObj: any = {
        sellerId: request.data.id,
        stripeBankAccountId: bankAccount.id,
        bankName: bankAccount.bank_name,
        fingerprint: bankAccount.fingerprint,
        last_4_digit: bankAccount.last4,
        accountHolderName: bankAccount.account_holder_name,
        accountHolderType: bankAccount.account_holder_type,
        routingNumber: bankAccount.routing_number,
        is_default: getBankAccounts.length ? false : true,
      };
      await this.bankService.create(bankObj);

      return response.formatter.ok({}, true, "ADD_BANK_ACCOUNT");
    } catch (error) {
      console.log("ERR:: ", error);

      return response.formatter.error(
        {},
        false,
        "BANK_ACCOUNT_ADD_FAILED",
        error
      );
    }
  }

  @Put("/update-defaultAccount", { transformResponse: true })
  async updateDefaultAccount(
    @Req() request: any,
    @Res() response: any,
    @Body({ validate: true }) body: bankDTO
  ) {
    try {
      const { bankAccountId } = body;
      const sellerData = await this.userService.findOne({
        _id: request.data.id,
      });

      if (!sellerData) {
        return response.formatter.error({}, false, "USER_NOT_FOUND");
      }
      const stripeActid = sellerData?.stp_account_id || null;

      if (!stripeActid) {
        return response.formatter.error({}, false, "STRIPE_ACCOUNT_NOT_FOUND");
      }

      await stripe.accounts.updateExternalAccount(stripeActid, bankAccountId, {
        default_for_currency: true,
      });

      await Promise.all([
        this.bankService.updateOne(
          {
            sellerId: request.data.id,
            stripeBankAccountId: bankAccountId,
          },
          { $set: { is_default: true } }
        ),
        this.bankService.updateMany(
          {
            sellerId: request.data.id,
            stripeBankAccountId: { $ne: bankAccountId },
          },
          {
            $set: { is_default: false },
          }
        ),
      ]);

      return response.formatter.ok(true, "BANK_ACCOUNT_UPDATE_SUCCESS");
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error(
        {},
        false,
        "BANK_ACCOUNT_UPDATE_FAILED",
        error
      );
    }
  }

  @Delete("/delete-externalAccount", { transformRequest: true })
  async deleteExternalAccount(
    @Req() request: any,
    @Res() response: any,
    @Body({ validate: true }) body: bankDTO
  ) {
    try {
      const { bankAccountId } = body;
      const sellerData = await this.userService.findOne({
        _id: request.data.id,
      });
      if (!sellerData) {
        return response.formatter.error({}, false, "USER_NOT_FOUND");
      }
      const stripeActid = sellerData?.stp_account_id || null;

      if (!stripeActid) {
        return response.formatter.error({}, false, "STRIPE_ACCOUNT_NOT_FOUND");
      }

      await stripe.accounts.deleteExternalAccount(stripeActid, bankAccountId);
      await this.bankService.updateOne(
        {
          stripeBankAccountId: bankAccountId,
          is_default: false,
        },
        {
          is_deleted: true,
        }
      );
      return response.formatter.ok(true, "BANK_ACCOUNT_DELETED_SUCCESS");
    } catch (error) {
      return response.formatter.error(
        {},
        false,
        "BANK_ACCOUNT_DELETED_FAILED",
        error
      );
    }
  }
}
