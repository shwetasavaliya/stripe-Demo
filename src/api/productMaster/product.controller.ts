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
import ProductService from "./product.service";
import {
  ProductDTO
} from "./product.validator";
import { Auth } from "../../middleware/auth";


@JsonController("/product")
@UseBefore(Auth)
export default class ProductController {
  private productService: ProductService = new ProductService();

  @Post("/create", { transformResponse: true })
  async productCreate(
    @Req() request: any,
    @Res() response: any,
    @Body({ validate: true }) body: ProductDTO
  ) {
    try {
      const { productName, description, price } = body;
      
      const productExists = await this.productService.findOne({ productName });
      if (productExists)
        return response.formatter.error({}, false, "PRODUCT_ALREADY_EXISTS");
     
      const productData: any = {
        sellerId:request.data.id,
        productName,
        description,
        price,
      };
      
      const productCreate: any = await this.productService.create(productData);

      return response.formatter.ok(
        productCreate,
        true,
        "PRODUCT_ADD_SUCCESS"
      );
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error({}, false, "PRODUCT_ADD_FAILED", error);
    }
  }

  @Get("/get", { transformResponse: true })
  async getProduct(@Req() request: any, @Res() response: any) {
    try {
      const product = await this.productService.find({sellerId:request.data.id});
      return response.formatter.ok(product, true, "PRODUCT_DISPLAY_SUCCESS");
    } catch (error) {
      console.log("ERR:: ", error);
      return response.formatter.error({}, false, "PRODUCT_DISPLAY_FAILED", error);
    }
  }

}
