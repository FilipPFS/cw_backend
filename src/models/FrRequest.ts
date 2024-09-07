import mongoose from "mongoose";

export interface FrRequestSchema {
  senderId: string;
  receiverId: string;
  accepted: boolean;
}

export const frRequestSchema = new mongoose.Schema<FrRequestSchema>({
  senderId: {
    type: String,
    required: true,
  },
  receiverId: {
    type: String,
    required: true,
  },
  accepted: {
    type: Boolean,
    default: false,
  },
});

const FrRequest = mongoose.model<FrRequestSchema>("FrRequest", frRequestSchema);

export default FrRequest;
