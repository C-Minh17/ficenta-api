import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transfers } from './schemas/transfer.schema';
import { Wallets } from '../wallet/schemas/wallet.schema';
import createdTransferDto from './dto/create-transfer.dto';

@Injectable()
export class TransferService {
  constructor(
    @InjectModel(Transfers.name) private readonly transferModel: Model<Transfers>,
    @InjectModel(Wallets.name) private readonly walletModel: Model<Wallets>
  ) { }

  async historyTransfer(userId: string) {
    const wallets = await this.walletModel.find(
      { user_id: userId },
      { _id: 1 }
    )
    const walletIds = wallets.map(a => a._id)
    const transfers = await this.transferModel.find({
      from_wallet_id: {
        $in: walletIds,
      }
    })

    return transfers
  }

  async createdTransfer(userId: string, data: createdTransferDto) {
    const walletFrom = await this.walletModel.findById(data.from_wallet_id)
    const walletTo = await this.walletModel.findById(data.to_wallet_id)

    if (!walletFrom || !walletTo) {
      throw new NotFoundException("Ví nguồn hoặc ví đích không tồn tại");
    }
    if (walletFrom.user_id.toString() !== userId || walletTo.user_id.toString() !== userId) {
      throw new ForbiddenException("Bạn không có quyền chuyển tiền sang ví không phải của mình");
    }
    if (!walletFrom.is_active || !walletTo.is_active) {
      throw new BadRequestException("Một trong hai ví đang ở trạng thái không hoạt động");
    }
    const amount = data.amount
    if (walletFrom.current_balance < data.amount) {
      throw new BadRequestException("Số dư ví nguồn không đủ để thực hiện chuyển tiền");
    }

    walletFrom.current_balance = walletFrom.current_balance - amount
    walletTo.current_balance = walletTo.current_balance + amount

    await walletFrom.save()
    await walletTo.save()

    const transfer = new this.transferModel(data)
    await transfer.save();
    return transfer
  }

}
