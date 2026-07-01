import { IsBoolean, IsIn, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator";

export default class createCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  icon?: string

  @IsNotEmpty()
  @IsIn(['income', ' expense'])
  type: 'income' | ' expense'

}