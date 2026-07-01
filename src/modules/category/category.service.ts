import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Categories } from './schemas/category.schema';
import { Model } from 'mongoose';

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
}
