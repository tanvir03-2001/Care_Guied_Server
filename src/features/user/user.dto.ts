export interface RegisterDto {
  email: string;
  password: string;
  interests?: string[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  role?: 'user' | 'admin';
  interests?: string[];
}

export interface UpdateUserDto {
  email?: string;
  password?: string;
  role?: 'user' | 'admin';
  interests?: string[];
}
