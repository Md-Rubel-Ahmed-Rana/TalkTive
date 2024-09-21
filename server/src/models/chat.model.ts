import { model, Schema } from "mongoose";
import { IChat } from "../interfaces/chat.interface";

const chatSchema = new Schema<IChat>(
  {
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    groupName: {
      type: String,
      default: null,
    },
    groupImage: {
      type: String,
      default: null,
    },
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  }
);

export const Chat = model<IChat>("Chat", chatSchema);
