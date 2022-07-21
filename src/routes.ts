import { Application } from "express";
import { useExpressServer } from "routing-controllers";
import UserController from "./api/user/user.controller";
import ProductController from "./api/productMaster/product.controller";
import OrderController from "./api/orderMaster/order.controller";
import CardController from "./api/cardMaster/card.controller";
import PaymentController from "./api/payment_master/payment.controller";
import BankController from "./api/bankMaster/bank.controller";

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
    ],
    defaultErrorHandler: true,
    routePrefix: basePath,
  });
}

export default initRoute;
