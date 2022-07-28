import { IsOptional, IsString, IsNumber, IsArray } from "class-validator";

export class OrderDTO {
  @IsArray()
  orderDetail: Array<object>;
}

export class TransferDTO {
  @IsString()
  sellerId: string;
}
