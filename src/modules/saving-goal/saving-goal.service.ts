import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SavingGoals } from './schema/saving-goal.schema';
import createSavingGoalDto from './dto/create-saving-goal.dto';
import { Wallets } from '../wallet/schemas/wallet.schema';
import updateSavingGoalDto from './dto/update-saving-goal.dto';

@Injectable()
export class SavingGoalService {
  constructor(
    @InjectModel(SavingGoals.name) private readonly savingGoalModel: Model<SavingGoals>,
    @InjectModel(Wallets.name) private readonly walletModel: Model<Wallets>
  ) { }

  async getSavingGoal(userId: string) {
    const savingGoal = await this.savingGoalModel.find({
      user_id: userId
    }).populate("wallet_id")

    return savingGoal
  }

  async createSavingGoal(userId: string, data: createSavingGoalDto) {
    const wallet = await this.walletModel.findById(data.wallet_id);
    if (!wallet) {
      throw new NotFoundException('Ví không tồn tại');
    }
    if (wallet.user_id.toString() !== userId) {
      throw new ForbiddenException('Ví không thuộc người dùng');
    }

    const savingGoal = new this.savingGoalModel({
      ...data,
      user_id: userId
    });
    await savingGoal.save();

    return savingGoal;
  }

  async updateSavingGoal(userId: string, id: string, data: updateSavingGoalDto) {
    const savingGoal = await this.savingGoalModel.findById(id);
    if (!savingGoal) {
      throw new NotFoundException("Mục tiêu không tồn tại");
    }

    if (userId !== savingGoal.user_id.toString()) {
      throw new ForbiddenException('Mục tiêu không thuộc người dùng');
    }

    if (data.wallet_id) {
      const wallet = await this.walletModel.findById(data.wallet_id);
      if (!wallet) {
        throw new NotFoundException('Ví không tồn tại');
      }
      if (wallet.user_id.toString() !== userId) {
        throw new ForbiddenException('Ví không thuộc người dùng');
      }
    }

    const savingGoalNew = await this.savingGoalModel.findByIdAndUpdate(id, data, { new: true });
    return savingGoalNew;
  }

  async deleteSavingGoal(userId: string, id: string) {
    const savingGoal = await this.savingGoalModel.findById(id);
    if (!savingGoal) {
      throw new NotFoundException("Mục tiêu không tồn tại");
    }

    if (userId !== savingGoal.user_id.toString()) {
      throw new ForbiddenException('Mục tiêu không thuộc người dùng');
    }

    const res = await this.savingGoalModel.findByIdAndDelete(id);
    return res;
  }

}
