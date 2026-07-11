import { IsMongoId, isMongoId, IsNotEmpty, IsNumber, IsString, Matches, Min } from "class-validator";

export default class createSavingGoalDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsMongoId()
  @IsNotEmpty()
  wallet_id: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  target_amount: number;

  @IsNotEmpty()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'target_date phải tuân theo định dạng YYYY-MM-DD' })
  target_date: string;
}