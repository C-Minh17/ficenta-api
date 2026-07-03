import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Wallets } from './schemas/wallet.schema';
import { InjectModel } from '@nestjs/mongoose';
import createWalletDto from './dto/create-wallet.dto';
import updateWalletDto from './dto/update-wallet.dto';

@Injectable()
export class WalletService {
  constructor(@InjectModel(Wallets.name) private readonly walletModel: Model<Wallets>) { }

  async getWallets(userId: string) {
    return await this.walletModel.find({ user_id: userId })
  }

  async getWalletById(walletId: string) {
    return await this.walletModel.findById(walletId)
  }

  async addWallet(dataWallet: createWalletDto) {
    const wallet = new this.walletModel({
      ...dataWallet,
      initial_balance: dataWallet.current_balance
    })
    await wallet.save()
    return wallet
  }

  async updateWallet(walletId: string, dataUpdate: updateWalletDto) {
    const res = await this.walletModel.findByIdAndUpdate(walletId, dataUpdate, { new: true })
    return res
  }

  async deleteWallet(walletId: string) {
    const res = await this.walletModel.findByIdAndDelete(walletId)
    return res
  }

  async updateStatus(walletId: string, isActive: boolean) {
    const res = await this.walletModel.findByIdAndUpdate(walletId, { is_active: isActive }, { new: true })
    return res
  }
}
