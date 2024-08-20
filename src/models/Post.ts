import mongoose from "mongoose";

export interface PostSchema {
  userId: string;
  content: string;
  img: string;
  likes: string[];
  comments: { userId: string; text: string }[];
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
    type: [String],
    default: [],
  },
  comments: {
    type: [{ userId: String, text: String }],
    default: [],
  },
});

const Post = mongoose.model<PostSchema>("Post", postSchema);

export default Post;
