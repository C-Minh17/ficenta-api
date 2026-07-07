import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type RefreshTokenDocument = HydratedDocument<RefreshToken>

@Schema()
export class RefreshToken {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  token: string; // hash refresh token

  @Prop()
  expiresAt: Date;

  @Prop({ default: false })
  revoked: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  replacedByToken?: string;

  @Prop()
  revokedAt?: Date;
}

export const schemaRefreshToken = SchemaFactory.createForClass(RefreshToken)