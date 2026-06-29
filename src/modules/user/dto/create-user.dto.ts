import { IsString } from "class-validator";

export default class createUserDto {
  @IsString()
  email: string

  @IsString()
  password: string;

  @IsString()
  phone: string;

  @IsString()
  full_name: string;

  @IsString()
  name: string;

  @IsString()
  gender: string;

  @IsString()
  picture?: string;
}