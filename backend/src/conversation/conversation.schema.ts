import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";
import { schemaOptions } from "src/utils/schemaOptions";

export type ConversationDocument = Conversation & Document;

export enum ConversationType {
  DIRECT = "direct",
  GROUP = "group",
}

@Schema(schemaOptions)
export class Conversation {
  @Prop({
    enum: ConversationType,
    required: true,
  })
  type: ConversationType;

  @Prop({
    type: [{ type: Types.ObjectId, ref: "User" }],
    required: true,
    index: true,
  })
  participants: Types.ObjectId[];

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop()
  slug?: string; // "rubel-john"

  @Prop({ default: true })
  isActive: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index(
  { participants: 1 },
  {
    unique: true,
    partialFilterExpression: { type: "direct" },
  },
);
