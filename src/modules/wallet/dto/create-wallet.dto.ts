import { IsBoolean, IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export default class createWalletDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsIn(['cash', 'bank', 'credit_card', 'savings'])
  @IsNotEmpty()
  type: 'cash' | 'bank' | 'credit_card' | 'savings';

  @IsString()
  @IsOptional()
  currency?: string;

  @IsNumber()
  @IsOptional()
  initial_balance?: number;

  @IsNumber()
  @IsOptional()
  current_balance?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}