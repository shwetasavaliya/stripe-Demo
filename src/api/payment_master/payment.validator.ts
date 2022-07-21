import { IsOptional, IsString, IsNumber, IsArray } from "class-validator";

export class payoutDTO {
  @IsNumber()
  amount: number;

  @IsString()
  bank_account: string;
}
