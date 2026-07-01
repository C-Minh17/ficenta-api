import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type WalletDocument = HydratedDocument<Wallets>;

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
export class Wallets {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true })
  user_id: mongoose.Types.ObjectId;

  @Prop({
    required: true,
    enum: ['cash', 'bank', 'credit_card', 'savings'],
  })
  type: 'cash' | 'bank' | 'credit_card' | 'savings';

  @Prop({ default: 'VND' })
  currency: string;

  @Prop({ type: Number, default: 0 })
  initial_balance: number;

  @Prop({ type: Number, default: 0 })
  current_balance: number;

  @Prop({ default: true })
  is_active: boolean;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const WalletSchema = SchemaFactory.createForClass(Wallets); 