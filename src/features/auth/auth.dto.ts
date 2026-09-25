export interface RegisterDto {
  email: string;
  password: string;
  interests?: string[];
}

export interface LoginDto {
  email: string;
  password: string;
}
