import mongoose from "mongoose";

export interface MessageSchema {
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
}

export const messageSchema = new mongoose.Schema<MessageSchema>({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: { type: Date, default: Date.now },
});

const Message = mongoose.model<MessageSchema>("Message", messageSchema);

export default Message;
