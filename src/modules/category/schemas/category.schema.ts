import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CategoryDocument = HydratedDocument<Categories>

@Schema({
  timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
})
export class Categories {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Users" })
  user_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  icon?: string

  @Prop({
    required: true,
    enum: ['income', 'expense']
  })
  type: 'income' | 'expense'

  @Prop({ required: true, default: false })
  is_default: boolean

  @Prop()
  created_at: Date;

  @Prop()
  updated_at: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Categories)