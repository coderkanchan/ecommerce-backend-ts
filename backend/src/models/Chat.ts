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

const chatSchema = new Schema<IChat>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    messages: [messageSchema],
  },
  {
    timestamps: true,
  }
);

export const Chat = model<IChat>('Chat', chatSchema);
