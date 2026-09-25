import { AppError } from '../../shared/middleware/error.middleware';
import { parsePagination, paginatedResult } from '../../shared/utils/pagination';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import { IUser, User } from './user.model';

function sanitize(user: IUser) {
  return user.toJSON();
}

export class UserService {
  async create(dto: CreateUserDto) {
    const existing = await User.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw new AppError('Email already in use', 409);
    }
    const user = await User.create({
      email: dto.email,
      password: dto.password,
      role: dto.role || 'user',
      interests: dto.interests || [],
    });
    return sanitize(user);
  }

  async list(query: { page?: string; limit?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const [data, total] = await Promise.all([
      User.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      User.countDocuments(),
    ]);
    return paginatedResult(data.map(sanitize), total, page, limit);
  }

  async getById(id: string) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return sanitize(user);
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await User.findById(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    if (dto.email !== undefined) user.email = dto.email;
    if (dto.password !== undefined) user.password = dto.password;
    if (dto.role !== undefined) user.role = dto.role;
    if (dto.interests !== undefined) user.interests = dto.interests;
    await user.save();
    return sanitize(user);
  }

  async remove(id: string) {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return { message: 'User deleted' };
  }

  /** Scenario 1: exactly one collection.aggregate() call */
  async groupByInterests() {
    return User.aggregate([
      { $unwind: '$interests' },
      {
        $group: {
          _id: '$interests',
          users: {
            $push: {
              _id: '$_id',
              email: '$email',
              role: '$role',
            },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          _id: 0,
          interest: '$_id',
          count: 1,
          users: 1,
        },
      },
    ]);
  }
}

export const userService = new UserService();
