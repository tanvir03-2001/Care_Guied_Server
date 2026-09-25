import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IPost extends Document {
  title: string;
  body: string;
  author: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Supports posts-by-author lookups
postSchema.index({ author: 1, createdAt: -1 });
// Supports the public post list sorted by title
postSchema.index({ title: 1 });

export const Post = mongoose.model<IPost>('Post', postSchema);
