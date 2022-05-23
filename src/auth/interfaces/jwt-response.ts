import { User } from '../entities/user.entity';

export interface AuthResponse {
  accessToken: string;
  user: User;
}
