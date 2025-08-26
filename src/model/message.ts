import mongoose, { Schema, Document } from "mongoose";
import { createId } from "../helpers/utils";

export interface IMessage extends Document {
  messageId: string;
  fullName: string;
  email: string;
  phone: string;
  message: string;
  createdAt?: Date;
}

const MessageSchema: Schema = new Schema<IMessage>(
  {
    messageId: {
      type: String,
      required: true,
      unique: true,
      default: createId,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
  },
  { 
    timestamps: true,
    id: false, // Disable the default `id` virtual getter
    toJSON: { 
      transform: function(doc, ret) {
        delete ret._id; // Remove _id from JSON responses
        return ret;
      }
    }
  }
);

export default mongoose.model<IMessage>("Message", MessageSchema);
