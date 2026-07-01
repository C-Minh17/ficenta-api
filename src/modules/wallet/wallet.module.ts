import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallets, WalletSchema } from './schemas/wallet.schema';

@Module({
  controllers: [WalletController],
  providers: [WalletService],
  imports: [MongooseModule.forFeature([{ name: Wallets.name, schema: WalletSchema }])]
})
export class WalletModule { }
