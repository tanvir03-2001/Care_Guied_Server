import { AppError } from '../../shared/middleware/error.middleware';
import { signToken } from '../../shared/utils/jwt';
import { User } from '../user/user.model';
import { LoginDto, RegisterDto } from './auth.dto';

export class AuthService {
  async register(dto: RegisterDto) {
    if (!dto.email || !dto.password) {
      throw new AppError('Email and password are required');
    }
    if (dto.password.length < 6) {
      throw new AppError('Password must be at least 6 characters');
    }

    const existing = await User.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw new AppError('Email already in use', 409);
    }

    const user = await User.create({
      email: dto.email,
      password: dto.password,
      role: 'user',
      interests: dto.interests || [],
    });

    const token = signToken({ sub: user.id, role: user.role });
    return { token, user: user.toJSON() };
  }

  async login(dto: LoginDto) {
    if (!dto.email || !dto.password) {
      throw new AppError('Email and password are required');
    }

    const user = await User.findOne({ email: dto.email.toLowerCase() });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const valid = await user.comparePassword(dto.password);
    if (!valid) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = signToken({ sub: user.id, role: user.role });
    return { token, user: user.toJSON() };
  }
}

export const authService = new AuthService();
