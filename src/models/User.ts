import mongoose from "mongoose";

export interface UserSchema {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  avatar: string;
  banner: string;
  description: string;
  userPosts: string[];
  likedPosts: string[];
  userEvents: string[];
  friends: string[];
}

const userSchema = new mongoose.Schema<UserSchema>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
  },
  banner: {
    type: String,
  },
  description: {
    type: String,
  },
  userPosts: {
    type: [String],
    default: [],
  },
  likedPosts: {
    type: [String],
    default: [],
  },
  userEvents: {
    type: [String],
    default: [],
  },
  friends: {
    type: [String],
    default: [],
  },
});

const User = mongoose.model<UserSchema>("User", userSchema);

export default User;
