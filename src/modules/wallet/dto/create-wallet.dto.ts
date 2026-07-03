import { IsBoolean, IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

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

  // @IsNumber()
  // @IsOptional()
  // @Min(0)
  // initial_balance?: number;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  current_balance?: number;

  @IsBoolean()
  @IsOptional()
  is_active?: boolean;
}