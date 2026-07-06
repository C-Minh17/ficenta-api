import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transactions, TransactionsSchema } from './schemas/transaction.schema';
import { WalletModule } from '../wallet/wallet.module';
import { CategoryModule } from '../category/category.module';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService],
  imports: [
    MongooseModule.forFeature([{ name: Transactions.name, schema: TransactionsSchema }]),
    WalletModule,
    CategoryModule
  ],
  exports: [TransactionService, MongooseModule]
})
export class TransactionModule { }
