import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categories } from './schemas/category.schema';
import { Model } from 'mongoose';
import createCategoryDto from './dto/create-category.dto';
import updateCategoryDto from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Categories.name) private readonly categoryModel: Model<Categories>) { }

  async getCategories(userId: string) {
    const categories = await this.categoryModel.find({
      $or: [
        { user_id: userId },
        { is_default: true }
      ]
    })

    return categories
  }

  async getCategoryById(id: string) {
    return this.categoryModel.findById(id)
  }

  async createCategory(data: createCategoryDto) {
    const category = new this.categoryModel(data)
    await category.save()
    return category
  }

  async updateCategory(id: string, data: updateCategoryDto) {
    const category = await this.categoryModel.findByIdAndUpdate(id, data, { new: true })
    return category
  }

  async deleteCategory(id: string) {
    const res = await this.categoryModel.findByIdAndDelete(id)
    return res
  }


}
