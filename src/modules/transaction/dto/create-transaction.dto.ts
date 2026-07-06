import { IsIn, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Matches, Min } from "class-validator";

export default class createTransactionDto {
  @IsMongoId()
  @IsNotEmpty()
  wallet_id: string;

  @IsMongoId()
  @IsNotEmpty()
  category_id: string;

  @IsIn(['income', 'expense'])
  @IsNotEmpty()
  type: 'income' | 'expense';

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @IsString()
  @IsOptional()
  note: string;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'transaction_date phải tuân theo định dạng YYYY-MM-DD' })
  transaction_date: string;
}