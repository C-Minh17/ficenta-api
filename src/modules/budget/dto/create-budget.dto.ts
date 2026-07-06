import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from "class-validator";

export default class createBudgetDto {
  @IsMongoId()
  @IsOptional()
  user_id: string;

  @IsMongoId()
  @IsNotEmpty()
  category_id: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount_limit: number;

  @IsString()
  @IsNotEmpty()
  month: string;

  @IsString()
  @IsNotEmpty()
  year: string;
}