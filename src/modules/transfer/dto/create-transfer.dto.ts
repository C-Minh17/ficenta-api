import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export default class createdTransferDto {
  @IsMongoId()
  @IsNotEmpty()
  from_wallet_id: string;

  @IsMongoId()
  @IsNotEmpty()
  to_wallet_id: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsOptional()
  note: string;

  @IsString()
  @IsNotEmpty()
  transfer_date: string;
}