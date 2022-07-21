import {
  IsOptional,
  IsString,
  IsNumber,
} from "class-validator";

export class CardDTO {

  @IsString()
  tokenId: string;
}
