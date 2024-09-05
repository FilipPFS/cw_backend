import mongoose from "mongoose";

export interface PostSchema {
  userId: string;
  content: string;
  img: string;
  likes: { userId: string }[];
  comments: { userId: string; text: string }[];
  createdAt: Date;
}

export const postSchema = new mongoose.Schema<PostSchema>({
  userId: {
    type: String,
    required: true,
  },
  content: {
    type: String,
  },
  img: {
    type: String,
  },
  likes: {
    type: [{ userId: String }],
    default: [],
  },
  comments: {
    type: [{ userId: String, text: String }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Post = mongoose.model<PostSchema>("Post", postSchema);

export default Post;
