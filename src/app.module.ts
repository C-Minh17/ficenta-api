import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { WalletModule } from './modules/wallet/wallet.module';
import { CategoryModule } from './modules/category/category.module';
import { TransferModule } from './modules/transfer/transfer.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { BudgetModule } from './modules/budget/budget.module';
import { SavingGoalModule } from './modules/saving-goal/saving-goal.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.SERVER_ADDRESS as string),
    AuthModule,
    UserModule,
    WalletModule,
    CategoryModule,
    TransferModule,
    TransactionModule,
    BudgetModule,
    SavingGoalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
