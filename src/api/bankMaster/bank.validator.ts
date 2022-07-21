import { IsOptional, IsString, IsNumber } from "class-validator";

export class BankDTO {
  @IsString()
  accountHolderName: string;

  @IsString()
  accountHolderType: string;

  @IsString()
  routingNumber: string;

  @IsString()
  accountNumber: string;
}
