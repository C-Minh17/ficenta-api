import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type BudgetDocument = HydratedDocument<Budgets>

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
export class Budgets {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true })
  user_id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Categories', required: true })
  category_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  month: string

  @Prop({ required: true })
  year: string

  @Prop({ required: true })
  amount_limit: number

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const BudgetSchema = SchemaFactory.createForClass(Budgets)