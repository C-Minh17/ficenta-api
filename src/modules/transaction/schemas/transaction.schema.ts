import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type TransactionDocument = HydratedDocument<Transactions>

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
export class Transactions {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Wallets', required: true })
  wallet_id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true })
  category_id: mongoose.Types.ObjectId;

  @Prop({ enum: ['income', 'expense'], required: true })
  type: 'income' | 'expense';

  @Prop({ required: true })
  amount: number

  @Prop()
  note: string

  @Prop({ required: true })
  transaction_date: string

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const TransactionsSchema = SchemaFactory.createForClass(Transactions)