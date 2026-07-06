import { Module } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { BudgetController } from './budget.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Budgets, BudgetSchema } from './schemas/budget.schema';
import { TransactionModule } from '../transaction/transaction.module';

@Module({
  controllers: [BudgetController],
  providers: [BudgetService],
  imports: [
    MongooseModule.forFeature([
      { name: Budgets.name, schema: BudgetSchema }
    ]),
    TransactionModule
  ]
})
export class BudgetModule { }
