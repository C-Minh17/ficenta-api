import { IsIn, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class createUserDto {
  @IsString()
  @IsNotEmpty()
  email: string

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(["male", "female", "other"])
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsOptional()
  picture?: string;
}