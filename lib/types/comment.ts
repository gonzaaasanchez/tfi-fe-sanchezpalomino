import { User } from './user';

export interface Comment {
  id?: string;
  comment: string;
  author: User;
  createdAt?: string;
  updatedAt?: string;
} 