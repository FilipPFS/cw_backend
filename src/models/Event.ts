import mongoose from "mongoose";

export interface EventSchema {
  hostId: string;
  title: string;
  description: string;
  coverImg: string;
  participants: { userId: string }[];
  createdAt: Date;
}

export const eventSchema = new mongoose.Schema<EventSchema>({
  hostId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  coverImg: {
    type: String,
  },
  participants: {
    type: [{ userId: String }],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model<EventSchema>("Event", eventSchema);

export default Event;
