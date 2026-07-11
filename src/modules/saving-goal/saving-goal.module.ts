import { Module } from '@nestjs/common';
import { SavingGoalService } from './saving-goal.service';
import { SavingGoalController } from './saving-goal.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SavingGoals, SavingGoalSchema } from './schema/saving-goal.schema';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  controllers: [SavingGoalController],
  providers: [SavingGoalService],
  imports: [
    MongooseModule.forFeature([{ name: SavingGoals.name, schema: SavingGoalSchema }]),
    WalletModule
  ]
})
export class SavingGoalModule { }
