import { Schema, model, Document, Types } from 'mongoose';

interface IMessage {
  role: 'user' | 'ai';
  content: string;
}

export interface IChat extends Document {
  user: Types.ObjectId;
  messages: IMessage[];
}

const messageSchema = new Schema<IMessage>(
  {
    role: { type: String, required: true },
    content: { type: String, required: true },
  },
  { _id: false }
);

const chatSchema = new Schema({
  userId: { type: String, required: true },

  messages: [
    {
      role: { type: String, enum: ["user", "ai"] },
      content: String,
    },
  ],
}, { timestamps: true });

export const Chat = model("Chat", chatSchema);


