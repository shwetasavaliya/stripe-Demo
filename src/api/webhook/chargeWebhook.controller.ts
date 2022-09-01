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
import RefundService from "../refundMaster/refund.service";
import UserService from "../user/user.service";
import { STRIPE_SECRET_KEY } from "../../config";
import { WEBHOOK_CHARGE_SECRET_KEY } from "../../config";
const stripe = require("stripe")(STRIPE_SECRET_KEY);

@JsonController("/chargeWebhook")
export default class ChargeWebhookController {
  private paymentService: PaymentService = new PaymentService();
  private refundService: RefundService = new RefundService();

  @Post("/create-charge", { transformResponse: true })
  async create(@Req() request: any, @Res() response: any) {
    try {
      if (WEBHOOK_CHARGE_SECRET_KEY) {
        let signature = request.headers["stripe-signature"];
        let stripeWebhook;
        try {
          stripeWebhook = stripe.webhooks.constructEvent(
            request.body,
            signature,
            WEBHOOK_CHARGE_SECRET_KEY
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
          case "charge.succeeded":
            {
              var { object: charge } = data;
              if (charge) {
                let { customerId, orderId } = charge.metadata;

                await this.paymentService.updateOne(
                  {
                    orderId: orderId,
                    userId: customerId,
                    payment_type: "charge",
                  },
                  { paymentStatus: "succeeded" }
                );
              }
            }
            break;

          case "charge.failed":
            {
              var { object: charge } = data;
              if (charge) {
                let { customerId, orderId } = charge.metadata;

                await this.paymentService.updateOne(
                  {
                    orderId: orderId,
                    userId: customerId,
                    payment_type: "charge",
                  },
                  { paymentStatus: "failed" }
                );
              }
            }
            break;
          case "charge.pending":
            {
              var { object: charge } = data;
              if (charge) {
                let { customerId, orderId } = charge.metadata;

                await this.paymentService.updateOne(
                  {
                    orderId: orderId,
                    userId: customerId,
                    payment_type: "charge",
                  },
                  { paymentStatus: "pending" }
                );
              }
            }
            break;

          case "charge.refunded":
            {
              var { object: charge } = data;
              if (charge) {
                let { customerId } = charge.metadata;
                await this.refundService.updateOne(
                  {
                    customerId: customerId,
                  },
                  {
                    stripeStatus: "successed",
                  }
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
