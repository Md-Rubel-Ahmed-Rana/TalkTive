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
    required: true,
    enum: ConversationType,
  })
  type: ConversationType;

  @Prop({
    type: Types.ObjectId,
    ref: "User",
    required: true,
  })
  createdBy: Types.ObjectId;

  @Prop({
    default: true,
  })
  isActive: boolean;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
