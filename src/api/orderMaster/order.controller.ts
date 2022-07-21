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
import OrderService from "./order.service";
import ProductService from "../productMaster/product.service";
import UserService from "../user/user.service";
import PaymentService from "../payment_master/payment.service";
import FeesService from "../feesMaster/fees.service";
import { OrderDTO, TransferDTO } from "./order.validator";
import { Auth } from "../../middleware/auth";
import { STRIPE_SECRET_KEY } from "../../config";
import Mongoose from "mongoose";
const stripe = require("stripe")(STRIPE_SECRET_KEY);

@JsonController("/order")
@UseBefore(Auth)
export default class OrderController {
  private orderService: OrderService = new OrderService();
  private productService: ProductService = new ProductService();
  private userService: UserService = new UserService();
  private paymentService: PaymentService = new PaymentService();
  private feesService: FeesService = new FeesService();

  @Post("/create", { transformResponse: true })
  async orderCreate(
    @Req() request: any,
    @Res() response: any,
    @Body({ validate: true }) body: OrderDTO
  ) {
    try {
      const { orderDetail } = body;
      let orderResult: any = [];
      var element: any;
      let totalAmount = 0;
      const paymentObj: any = [];

      const [customerFee, sellerFee]: any = await Promise.all([
        this.feesService.findOne({ fee_type: "customer" }),
        this.feesService.findOne({ fee_type: "seller" }),
      ]);

      //charge
      for (element of orderDetail) {
        const product: any = await this.productService.findOne({
          _id: element.productId,
        });
        totalAmount += product?.price * element.quantity || 0;
        let productData = {
          productId: product._id,
          quantity: element.quantity,
          price: product?.price * element.quantity || 0,
        };
        orderResult.push(productData);
      }
      const orderData: any = {
        orderDetail: orderResult,
        customerId: request.data.id,
        totalAmount,
      };
      const orderCreate: any = await this.orderService.create(orderData);

      let chargePercentage: any;
      for (const feeData of customerFee.fee_structure) {
        if (
          totalAmount <= feeData.max_amount &&
          totalAmount >= feeData.min_amount
        ) {
          chargePercentage = feeData.percentage;
          break;
        }
      }

      const feeAmount = (totalAmount * chargePercentage) / 100;
      const finalAmount = totalAmount + feeAmount;

      const customer: any = await this.userService.findOne({
        _id: request.data.id,
      });

      const charge: any = await stripe.charges.create({
        amount: finalAmount * 100,
        currency: "usd",
        description: "Payment from customer",
        customer: customer.stp_cust_id,
        metadata: {
          customerId: request.data.id,
          orderId: orderCreate._id,
        },
      });

      paymentObj.push({
        orderId: orderCreate?._id,
        userId: request.data.id,
        stripe_txn_id: charge.id,
        payment_type: charge.object,
        amount: charge.amount / 100 || 0,
        currency: charge.currency,
        paymentStatus: charge.status,
        paymentInfo: charge.outcome,
        feeAmount: feeAmount,
        feePercentage: chargePercentage,
      });

      //Transfer
      let ele: any;
      for (ele of orderDetail) {
        const product: any = await this.productService.findOne({
          _id: ele.productId,
        });

        let transferPercentage: any;
        for (const feeData of sellerFee.fee_structure) {
          if (
            product?.price <= feeData.max_amount &&
            product?.price >= feeData.min_amount
          ) {
            transferPercentage = feeData.percentage;
            break;
          }
        }
        const transferFeeAmount = (product?.price * transferPercentage) / 100;
        const transferAmount = product?.price - transferFeeAmount;

        paymentObj.push({
          orderId: orderCreate?._id,
          userId: product.sellerId,
          payment_type: "transfer",
          amount: transferAmount || 0,
          currency: "usd",
          paymentStatus: "pending",
          feeAmount: transferFeeAmount,
          feePercentage: transferPercentage,
        });
      }
      await this.paymentService.bulkCreate(paymentObj);
      return response.formatter.ok(orderCreate, true, "ORDER_ADD_SUCCESS");
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error({}, false, "ORDER_ADD_FAILED", error);
    }
  }

  @Post("/payment-transfer", { transformResponse: true })
  async productCreate(
    @Req() request: any,
    @Res() response: any,
    @Body({ validate: true }) body: TransferDTO
  ) {
    try {
      const { sellerId } = body;

      const sellerData: any = await this.userService.findOne({
        _id: sellerId,
      });

      if (!sellerData) {
        return response.formatter.error(false, "SELLER_NOT_FOUND");
      }
      const group = [
        {
          $match: {
            userId: Mongoose.Types.ObjectId(sellerId),
            payment_type: "transfer",
            stripe_txn_id: null,
          },
        },
        {
          $group: {
            _id: "$userId",
            TotalAmount: {
              $sum: "$amount",
            },
          },
        },
      ];
      console.log("group::::::", group);

      const orderData: any = await this.paymentService.aggregate(group);
      console.log(" orderData[0]:::", orderData[0]);
      if (orderData && orderData.length) {
        if (sellerData.stp_account_id) {
          const transfer = await stripe.transfers.create({
            amount: orderData[0].TotalAmount * 100 || 0,
            currency: "usd",
            destination: sellerData.stp_account_id,
            transfer_group: sellerId,
            description: "Payment recieved",
            metadata: {
              sellerId: request.data.id,
            },
          });
          const update = {
            stripe_txn_id: transfer.id,
            paymentInfo: transfer.metadata,
          };
          await this.paymentService.updateMany(
            { userId: sellerId, payment_type: "transfer", stripe_txn_id: null },
            { $set: update }
          );
        }
      }
      return response.formatter.ok(true, "TRANSFER_CREATE_SUCESSFULLY");
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error(
        {},
        false,
        "TRANSFER_CREATE_FAILED",
        error
      );
    }
  }

  @Get("/get", { transformResponse: true })
  async getProduct(@Req() request: any, @Res() response: any) {
    try {
      const product = await this.orderService.find({
        customerId: request.data.id,
      });
      return response.formatter.ok(product, true, "ORDER_DISPLAY_SUCCESS");
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error({}, false, "ORDER_DISPLAY_FAILED", error);
    }
  }
}
