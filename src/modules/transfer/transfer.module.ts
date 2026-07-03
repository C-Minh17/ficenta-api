import { Module } from '@nestjs/common';
import { TransferService } from './transfer.service';
import { TransferController } from './transfer.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transfers, TransferSchema } from './schemas/transfer.schema';
import { WalletService } from '../wallet/wallet.service';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  controllers: [TransferController],
  providers: [TransferService],
  imports: [
    MongooseModule.forFeature([
      { name: Transfers.name, schema: TransferSchema }
    ]),
    WalletModule
  ]
})
export class TransferModule { }
