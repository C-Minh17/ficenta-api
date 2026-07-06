import { InjectModel } from '@nestjs/mongoose';
import { Budgets } from './schemas/budget.schema';
import { Model } from 'mongoose';
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import createBudgetDto from './dto/create-budget.dto';
import updateBudgetDto from './dto/update-budget.dto';
import { Transactions } from '../transaction/schemas/transaction.schema';
import { TransactionService } from '../transaction/transaction.service';

@Injectable()
export class BudgetService {
  constructor(
    @InjectModel(Budgets.name) private readonly budgetModel: Model<Budgets>,
    private readonly transactionService: TransactionService,
  ) { }

  async getAllBudget(userId: string, month: string, year: string) {
    const now = new Date();
    const targetMonth = month || String(now.getMonth() + 1).padStart(2, '0');
    const targetYear = year || String(now.getFullYear());

    const transactions = await this.transactionService.getExpenseTransactionsByMonth(userId, targetMonth, targetYear);

    const spentByCategory: Record<string, number> = {};
    for (const transaction of transactions) {
      const catId = String(transaction.category_id);
      spentByCategory[catId] = (spentByCategory[catId] || 0) + transaction.amount;
    }

    const budgets = await this.budgetModel.find({
      user_id: userId,
      month: targetMonth,
      year: targetYear
    }).populate("category_id");

    return budgets.map(budget => {
      const budgetObj = budget.toObject();
      const catId = typeof budgetObj.category_id === 'object' && budgetObj.category_id
        ? String((budgetObj.category_id as any)._id)
        : String(budgetObj.category_id);

      return {
        ...budgetObj,
        spent: spentByCategory[catId] || 0
      };
    });
  }

  async createBudget(data: createBudgetDto) {
    const existingBudget = await this.budgetModel.findOne({
      user_id: data.user_id,
      category_id: data.category_id,
      month: data.month,
      year: data.year,
    });
    if (existingBudget) {
      throw new BadRequestException("Ngân sách cho danh mục này trong tháng đã tồn tại");
    }

    const budget = new this.budgetModel(data)
    await budget.save()
    return budget
  }

  async updateBudget(userId: string, id: string, data: updateBudgetDto) {
    const budget = await this.budgetModel.findById(id)
    if (!budget) {
      throw new NotFoundException("Ngân sách không tồn tại")
    }
    if (budget.user_id.toString() !== userId) {
      throw new ForbiddenException("Bạn không có quyền sửa đổi")
    }

    const { user_id, ...updateData } = data;
    const res = await this.budgetModel.findByIdAndUpdate(id, updateData, { new: true })

    return res
  }

  async deleteBudget(userId: string, id: string) {
    const budget = await this.budgetModel.findById(id)
    if (!budget) {
      throw new NotFoundException("Ngân sách không tồn tại")
    }
    if (budget.user_id.toString() !== userId) {
      throw new ForbiddenException("Bạn không có quyền sửa đổi")
    }

    const res = await this.budgetModel.findByIdAndDelete(id)

    return res
  }

}
