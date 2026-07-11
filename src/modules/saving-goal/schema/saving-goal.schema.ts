import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type SavingGoalDocument = HydratedDocument<SavingGoals>

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})
export class SavingGoals {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true })
  user_id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallets', required: true })
  wallet_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Number, required: true })
  target_amount: number;

  @Prop({ required: true })
  target_date: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const SavingGoalSchema = SchemaFactory.createForClass(SavingGoals)