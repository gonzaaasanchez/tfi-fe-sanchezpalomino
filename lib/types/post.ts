import { User } from './user';

export interface Post {
  id?: string;
  title: string;
  description: string;
  image: string;
  imageBuffer?: Buffer;
  imageContentType?: string;
  author: User;
  commentsCount: number;
  likesCount: number;
  createdAt?: string;
  updatedAt?: string;
}
