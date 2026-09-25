import mongoose from 'mongoose';
import { AppError } from '../../shared/middleware/error.middleware';
import { AuthUser } from '../../shared/types/express.d';
import { parsePagination, paginatedResult } from '../../shared/utils/pagination';
import { User } from '../user/user.model';
import { CreatePostDto, UpdatePostDto } from './post.dto';
import { Post } from './post.model';

export class PostService {
  async create(authorId: string, dto: CreatePostDto) {
    if (!dto.title || !dto.body) {
      throw new AppError('Title and body are required');
    }
    return Post.create({
      title: dto.title,
      body: dto.body,
      author: authorId,
    });
  }

  async list(query: { page?: string }) {
    const limit = 10;
    const { page, skip } = parsePagination({ page: query.page, limit: String(limit) });
    const [data, total] = await Promise.all([
      Post.find().sort({ title: 1 }).skip(skip).limit(limit).populate('author', 'email'),
      Post.countDocuments(),
    ]);
    return paginatedResult(data, total, page, limit);
  }

  async getById(id: string) {
    const post = await Post.findById(id).populate('author', 'email');
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    return post;
  }

  async update(user: AuthUser, id: string, dto: UpdatePostDto) {
    const post = await Post.findById(id);
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    if (user.role !== 'admin' && post.author.toString() !== user.id) {
      throw new AppError('Forbidden', 403);
    }
    if (dto.title !== undefined) post.title = dto.title;
    if (dto.body !== undefined) post.body = dto.body;
    await post.save();
    return post;
  }

  async remove(user: AuthUser, id: string) {
    const post = await Post.findById(id);
    if (!post) {
      throw new AppError('Post not found', 404);
    }
    if (user.role !== 'admin' && post.author.toString() !== user.id) {
      throw new AppError('Forbidden', 403);
    }
    await post.deleteOne();
    return { message: 'Post deleted' };
  }

  /**
   * Scenario 2: single aggregation pipeline with $lookup
   * Retrieve all posts belonging to a particular user.
   */
  async getPostsByUser(userId: string) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new AppError('Invalid user id', 400);
    }

    const result = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'author',
          as: 'posts',
        },
      },
      {
        $project: {
          _id: 1,
          email: 1,
          role: 1,
          posts: {
            $sortArray: { input: '$posts', sortBy: { createdAt: -1 } },
          },
        },
      },
    ]);

    if (!result.length) {
      throw new AppError('User not found', 404);
    }

    return result[0];
  }
}

export const postService = new PostService();
