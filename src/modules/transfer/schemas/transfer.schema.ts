import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type TransferDocument = HydratedDocument<Transfers>

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})
export class Transfers {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Wallets", required: true })
  from_wallet_id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Wallets", required: true })
  to_wallet_id: mongoose.Types.ObjectId;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop()
  note: string;

  @Prop({ required: true })
  transfer_date: string;

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const TransferSchema = SchemaFactory.createForClass(Transfers)