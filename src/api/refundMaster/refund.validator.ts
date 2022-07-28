import { IsOptional, IsString, IsNumber } from "class-validator";

export class RefundDTO {
  @IsString()
  productId: string;

  @IsString()
  chargeId: string;
}
