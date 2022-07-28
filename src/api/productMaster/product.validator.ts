import {
  IsOptional,
  IsString,
  IsNumber,
} from "class-validator";

export class ProductDTO {

  @IsString()
  productName: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  price: number;
}
