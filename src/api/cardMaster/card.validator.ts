import { IsOptional, IsString, IsNumber } from "class-validator";

export class DeleteCardDTO {
  @IsString()
  cardId: string;
}
