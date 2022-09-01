import { IsOptional, IsString, IsNumber } from "class-validator";

export class payoutDTO {
  @IsNumber()
  paymentAmount: number;

  @IsString()
  @IsOptional()
  bank_account: string;
}
