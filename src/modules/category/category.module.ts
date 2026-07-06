import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Categories, CategorySchema } from './schemas/category.schema';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [MongooseModule.forFeature([
    { name: Categories.name, schema: CategorySchema }
  ])],
  exports: [CategoryService, MongooseModule]
})
export class CategoryModule { }
