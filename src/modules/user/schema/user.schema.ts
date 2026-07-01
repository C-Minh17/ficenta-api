import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserDocument = HydratedDocument<Users>

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})
export class Users {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop({ required: true })
  full_name: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, enum: ["male", "female", "other"] })
  gender: string;

  @Prop()
  picture?: string;

  @Prop()
  created_at: Date

  @Prop()
  updated_at: Date
}

export const UserSchema = SchemaFactory.createForClass(Users);