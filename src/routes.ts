import { Application } from "express";
import { useExpressServer } from "routing-controllers";
import UserController from "./api/user/user.controller";
import ProductController from "./api/productMaster/product.controller";
import OrderController from "./api/orderMaster/order.controller";
import CardController from "./api/cardMaster/card.controller";
import PaymentController from "./api/payment_master/payment.controller";
import BankController from "./api/bankMaster/bank.controller";
import PayoutController from "./api/payout_master/payout.controller";
import RefundController from "./api/refundMaster/refund.controller";
import WebhookController from "./api/webhook/webhook.controller";
import ChargeWebhookController from "./api/webhook/chargeWebhook.controller";
import TransferWebhookController from "./api/webhook/transferWebhook.controller";

const basePath = `/api/v1`;

function initRoute(app: Application) {
  useExpressServer(app, {
    controllers: [
      UserController,
      ProductController,
      OrderController,
      CardController,
      PaymentController,
      BankController,
      PayoutController,
      RefundController,
      WebhookController,
      ChargeWebhookController,
      TransferWebhookController,
    ],
    defaultErrorHandler: true,
    routePrefix: basePath,
  });
}

export default initRoute;
