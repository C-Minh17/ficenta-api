import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Transactions } from './schemas/transaction.schema';
import { Model } from 'mongoose';
import { Wallets } from '../wallet/schemas/wallet.schema';
import createTransactionDto from './dto/create-transaction.dto';
import { Categories } from '../category/schemas/category.schema';
import updateTransactionDto from './dto/update-transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transactions.name) private readonly transactionModel: Model<Transactions>,
    @InjectModel(Wallets.name) private readonly walletModel: Model<Wallets>,
    @InjectModel(Categories.name) private readonly CategoryModel: Model<Categories>,
  ) { }

  async getTransactionAll(userId: string) {
    const wallets = await this.walletModel.find(
      { user_id: userId },
      { _id: 1 }
    );
    const listWalletId = wallets.map(e => e._id);

    const transactions = await this.transactionModel
      .find({ wallet_id: { $in: listWalletId } })
      .populate('wallet_id')
      .populate('category_id');

    return transactions;
  }

  async getTransactionId(userId: string, id: string) {
    const wallets = await this.walletModel.find(
      { user_id: userId },
      { _id: 1 }
    );
    const listWalletId = wallets.map(e => e._id);

    const transaction = await this.transactionModel
      .findOne({
        _id: id,
        wallet_id: { $in: listWalletId },
      })
      .populate('wallet_id')
      .populate('category_id');

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }
    return transaction;
  }

  async createTransaction(userId: string, data: createTransactionDto) {
    const wallet = await this.walletModel.findById(data.wallet_id);
    const category = await this.CategoryModel.findById(data.category_id);

    if (!wallet) {
      throw new NotFoundException("ví không tồn tại");
    }

    if (!category) {
      throw new NotFoundException("danh mục không tồn tại");
    }

    if (category.user_id && category.user_id.toString() !== userId) {
      throw new BadRequestException("danh mục không phải của bạn");
    }

    if (wallet.user_id.toString() !== userId) {
      throw new BadRequestException("bạn không có quyền với ví này");
    }

    if (category.type !== data.type) {
      throw new BadRequestException("loại giao dịch không trùng khớp với loại danh mục");
    }

    const transaction = new this.transactionModel(data);
    await transaction.save();

    if (transaction.type === "income") {
      wallet.current_balance += transaction.amount;
    } else {
      wallet.current_balance -= transaction.amount;
    }
    await wallet.save();

    return transaction;
  }

  async updateTransaction(userId: string, id: string, data: updateTransactionDto) {
    const transaction = await this.transactionModel.findById(id);
    if (!transaction) {
      throw new NotFoundException("giao dịch không tồn tại");
    }

    const targetWalletId = data.wallet_id || transaction.wallet_id.toString();
    const targetCategoryId = data.category_id || transaction.category_id.toString();
    const targetType = data.type || transaction.type;
    const targetAmount = data.amount !== undefined ? data.amount : transaction.amount;

    const wallet = await this.walletModel.findById(targetWalletId);
    const category = await this.CategoryModel.findById(targetCategoryId);

    if (!wallet) {
      throw new NotFoundException("ví không tồn tại");
    }

    if (!category) {
      throw new NotFoundException("danh mục không tồn tại");
    }

    if (category.user_id && category.user_id.toString() !== userId) {
      throw new BadRequestException("danh mục không phải của bạn");
    }

    if (wallet.user_id.toString() !== userId) {
      throw new BadRequestException("bạn không có quyền với ví này");
    }

    if (category.type !== targetType) {
      throw new BadRequestException("loại giao dịch không trùng khớp với loại danh mục");
    }

    const isSameWallet = transaction.wallet_id.toString() === wallet._id.toString();

    if (isSameWallet) {
      if (transaction.type === "income") {
        wallet.current_balance -= transaction.amount;
      } else {
        wallet.current_balance += transaction.amount;
      }

      if (targetType === "income") {
        wallet.current_balance += targetAmount;
      } else {
        wallet.current_balance -= targetAmount;
      }
      await wallet.save();
    } else {
      const oldWallet = await this.walletModel.findById(transaction.wallet_id);
      if (!oldWallet) {
        throw new NotFoundException("ví cũ của giao dịch không tồn tại");
      }
      if (transaction.type === "income") {
        oldWallet.current_balance -= transaction.amount;
      } else {
        oldWallet.current_balance += transaction.amount;
      }
      await oldWallet.save();

      if (targetType === "income") {
        wallet.current_balance += targetAmount;
      } else {
        wallet.current_balance -= targetAmount;
      }
      await wallet.save();
    }

    const transactionUpdate = await this.transactionModel.findByIdAndUpdate(id, data, { new: true });
    if (!transactionUpdate) {
      throw new NotFoundException("giao dịch không tồn tại");
    }

    return transactionUpdate;
  }

  async deleteTransaction(userId: string, id: string) {
    const wallets = await this.walletModel.find(
      { user_id: userId },
      { _id: 1 }
    );
    const listWalletId = wallets.map(e => e._id);

    const transaction = await this.transactionModel.findOne({
      _id: id,
      wallet_id: { $in: listWalletId },
    });
    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    const wallet = await this.walletModel.findById(transaction.wallet_id.toString());
    if (!wallet) {
      throw new NotFoundException('wallet not found');
    }

    if (transaction.type === "income") {
      wallet.current_balance -= transaction.amount;
    } else {
      wallet.current_balance += transaction.amount;
    }
    await wallet.save();

    return await this.transactionModel.findByIdAndDelete(id);
  }

  async getExpenseTransactionsByMonth(userId: string, month: string, year: string) {
    const wallets = await this.walletModel.find({ user_id: userId }, { _id: 1 });
    const walletIds = wallets.map(w => w._id);
    const paddedMonth = month.padStart(2, '0');
    const datePrefix = `${year}-${paddedMonth}`;
    return this.transactionModel.find({
      wallet_id: { $in: walletIds },
      type: 'expense',
      transaction_date: { $regex: new RegExp(`^${datePrefix}`) }
    });
  }
}
