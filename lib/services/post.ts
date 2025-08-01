import { ClientApi } from './api/ssc';
import { Post } from '../types/post';
import { Comment } from '../types/comment';
import { BaseResponse, PaginatedResponse } from '../types/response';

export class PostService {
  private static readonly BASE_URL = '/posts';

  static async getPosts(params: {
    search: string;
    limit: number;
    page?: number;
  }): Promise<PaginatedResponse<Post>> {
    try {
      const response = await ClientApi.get<{
        success: boolean;
        data: PaginatedResponse<Post>;
        message?: string;
      }>(this.BASE_URL, {
        params: {
          search: params.search,
          limit: params.limit,
          page: params.page || 1,
        },
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getPost(id: string): Promise<Post> {
    try {
      const response = await ClientApi.get<BaseResponse<Post>>(
        `${this.BASE_URL}/admin/${id}`
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }

  static async getPostComments(
    postId: string,
    params: {
      limit: number;
      page?: number;
    }
  ): Promise<PaginatedResponse<Comment>> {
    try {
      const response = await ClientApi.get<{
        success: boolean;
        data: PaginatedResponse<Comment>;
        message?: string;
      }>(`comments/posts/${postId}/comments`, {
        params: {
          limit: params.limit,
          page: params.page || 1,
        },
      });

      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
} 