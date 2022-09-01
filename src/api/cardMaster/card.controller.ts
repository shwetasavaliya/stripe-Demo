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
import CardService from "./card.service";
import UserService from "../user/user.service";
import { DeleteCardDTO } from "./card.validator";
import { Auth } from "../../middleware/auth";
import { STRIPE_SECRET_KEY } from "../../config";
const stripe = require("stripe")(STRIPE_SECRET_KEY);

@JsonController("/card")
@UseBefore(Auth)
export default class CardController {
  private cardService: CardService = new CardService();
  private userService: UserService = new UserService();

  @Post("/create", { transformResponse: true })
  async cardCreate(@Req() request: any, @Res() response: any) {
    try {
      // const { tokenId } = body;

      const userInfo = await this.userService.findOne({ _id: request.data.id });
      if (!userInfo)
        return response.formatter.error({}, false, "USER_DOES_NOT_EXISTS");

      let stripeCustId = userInfo?.stp_cust_id || null;
      if (!stripeCustId) {
        const customer = await stripe.customers.create({
          name: `${userInfo["firstName"]} ${userInfo["lastName"]}`,
          email: userInfo["email"],
          description: `userId: ${userInfo["_id"]}`,
        });
        stripeCustId = customer.id || null;

        const update: any = {
          stp_cust_id: stripeCustId,
        };
        await this.userService.update(
          { _id: request.data.id },
          { $set: update }
        );
      }
      const token1 = await stripe.tokens.create({
        card: {
          number: "5555555555554444",
          exp_month: 7,
          exp_year: 2023,
          cvc: "314",
        },
      });
      console.log("token1", token1);
      const token = await stripe.tokens.retrieve(token1.id);

      const getUser = await this.cardService.findOne({
        customerId: request.data.id,
        fingerprint: token.card.fingerprint,
      });
      if (getUser) {
        return response.formatter.error({}, false, "CARD ALREADY EXIST");
      } else {
        const source = await stripe.customers.createSource(stripeCustId, {
          source: token.id,
        });
        const cardObj: any = {
          customerId: request.data.id,
          stripe_card_id: source.id,
          fingerprint: source.fingerprint,
          last_4_digit: source.last4,
          exp_date: `${source.exp_month}/${source.exp_year}`,
        };
        await this.cardService.create(cardObj);
      }

      const cardDetail = await this.cardService.findOne({
        customerId: request.data.id,
      });

      if (cardDetail) {
        await this.userService.updateOne(
          { _id: cardDetail.customerId },
          { $set: { stp_account_status: "verified" } }
        );
      }

      return response.formatter.ok(true, "CARD_ADD_SUCCESS");
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error({}, false, "CARD_ADD_FAILED", error);
    }
  }

  @Delete("/delete-card", { transformRequest: true })
  async cardDelete(
    @Req() request: any,
    @Res() response: any,
    @Body({ validate: true }) body: DeleteCardDTO
  ) {
    try {
      const { cardId } = body;
      const userData = await this.userService.findOne({ _id: request.data.id });
      if (!userData) {
        return response.formatter.error({}, false, "CUSTOMER_NOT_EXIST");
      }

      const stpAccountId = userData?.stp_cust_id || null;

      await stripe.customers.deleteSource(stpAccountId, cardId);

      await this.cardService.updateOne(
        {
          stripe_card_id: cardId,
        },
        { $set: { is_deleted: true } }
      );

      return response.formatter.ok(true, "CARD_DELETED_SUCCESS");
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error({}, false, "CARD_DELETE_FAILED", error);
    }
  }
}
