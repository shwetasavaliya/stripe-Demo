import {
  IsEmail,
  IsOptional,
  IsString,
  IsNumber,
} from "class-validator";

export class UserDTO {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  phoneNo: string;

  @IsString()
  @IsOptional()
  userImage: string;

  @IsString()
  role: string;
}

export class UserEmailDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}


