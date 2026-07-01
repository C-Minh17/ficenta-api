import { IsBoolean, IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class createCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsMongoId()
  @IsOptional()
  user_id: string;

  @IsString()
  @IsOptional()
  icon?: string

  @IsNotEmpty()
  @IsIn(['income', 'expense'])
  type: 'income' | 'expense';

  // @IsBoolean()
  // @IsOptional()
  // is_default?: boolean

}