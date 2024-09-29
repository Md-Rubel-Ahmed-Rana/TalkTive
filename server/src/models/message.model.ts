import { model, Schema } from "mongoose";
import { IMessage } from "../interfaces/message.interface";
import { Chat } from "./chat.model";

const messageSchema = new Schema<IMessage>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      require: false,
    },
    clearedBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }],
    media: [
      {
        type: {
          type: String,
          enum: ["image", "audio", "video", "document"],
          required: true,
        },
        url: { type: String, required: true },
      },
    ],
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
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

messageSchema.post("save", async function (doc) {
  try {
    await Chat.findByIdAndUpdate(doc.chatId, { lastMessage: doc?._id });
  } catch (err) {
    console.error("Error updating lastMessage in Chat:", err);
  }
});

export const Message = model<IMessage>("Message", messageSchema);
