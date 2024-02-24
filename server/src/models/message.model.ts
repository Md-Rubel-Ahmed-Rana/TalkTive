import { Schema, model } from "mongoose";
import { IMessage } from "../interfaces/message.interface";

const messageSchema = new Schema<IMessage>(
  {
    poster: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    conversationId: {
      type: String,
      required: true,
    },

    text: {
      type: String,
    },
    images: [{ type: String }],
    files: [{ type: String }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
  }
);

export const Message = model<IMessage>("Message", messageSchema);
