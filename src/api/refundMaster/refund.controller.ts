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
import RefundService from "./refund.service";
import ProductService from "../productMaster/product.service";
import PaymentService from "../payment_master/payment.service";
import OrderDetailService from "../orderDetailMaster/orderDetail.service";
import { RefundDTO } from "./refund.validator";
import { Auth } from "../../middleware/auth";
import { STRIPE_SECRET_KEY } from "../../config";
import Mongoose from "mongoose";
const stripe = require("stripe")(STRIPE_SECRET_KEY);

@JsonController("/refund")
@UseBefore(Auth)
export default class RefundController {
  private productService: ProductService = new ProductService();
  private refundService: RefundService = new RefundService();
  private paymentService: PaymentService = new PaymentService();
  private orderDetailService: OrderDetailService = new OrderDetailService();

  @Post("/create-refund", { transformResponse: true })
  async productCreate(
    @Req() request: any,
    @Res() response: any,
    @Body({ validate: true }) body: RefundDTO
  ) {
    try {
      const { productId, chargeId } = body;

      const productExists = await this.productService.findOne({
        _id: productId,
      });
      if (!productExists)
        return response.formatter.error({}, false, "PRODUCT_NOT_EXISTS");

      const paymentagg = [
        {
          $match: {
            stripe_txn_id: chargeId,
          },
        },
        {
          $lookup: {
            from: "order_masters",
            localField: "orderId",
            foreignField: "_id",
            as: "orderId",
          },
        },
        {
          $unwind: {
            path: "$orderId",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $unwind: {
            path: "$orderId.orderDetail",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            "orderId.orderDetail.productId": new Mongoose.Types.ObjectId(
              productId
            ),
          },
        },
        {
          $lookup: {
            from: "product_masters",
            localField: "orderId.orderDetail.productId",
            foreignField: "_id",
            as: "orderId.orderDetail.productId",
          },
        },
        {
          $unwind: {
            path: "$orderId.orderDetail.productId",
            preserveNullAndEmptyArrays: true,
          },
        },
      ];

      let totalAmount: any;
      const payment: any = await this.paymentService.aggregate(paymentagg);

      let amount =
        payment[0].orderId.orderDetail.productId.price *
        payment[0].orderId.orderDetail.quantity;
      totalAmount = amount || 0;

      const refund: any = await stripe.refunds.create({
        charge: chargeId,
        amount: totalAmount * 100,
      });

      const refundObj: any = {
        productId: productId,
        customerId: request.data.id,
        amount: refund.amount / 100,
        stripeRefundId: refund.id,
        stripeChargeId: refund.charge,
        stripeStatus: refund.status,
      };

      await this.refundService.create(refundObj);
      await this.orderDetailService.updateOne(
        {
          orderId: payment[0].orderId._id,
          productId: productId,
        },
        { $set: { status: "return" } }
      );

      return response.formatter.ok(true, "REFUND_ADD_SUCCESS");
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error({}, false, "REFUND_ADD_FAILED", error);
    }
  }
}
