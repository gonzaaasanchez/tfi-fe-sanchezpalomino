import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PostService } from '../services/post';
import { Post } from '../types/post';
import { UseGetAllType, UseGetOneByIdType } from '../types/hooks';
import { DEFAULT_PARAM_LIMIT } from '../constants/params';

export function useGetPosts(params?: UseGetAllType) {
  const [search, setSearch] = useState<string>(params?.initialSearch || '');
  const [currentPage, setCurrentPage] = useState<number>(params?.page || 1);

  const { data, isPending } = useQuery({
    queryKey: ['/posts', search, currentPage],
    queryFn: () =>
      PostService.getPosts({
        search,
        limit: params?.limit || DEFAULT_PARAM_LIMIT,
        page: currentPage,
      }),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
  });

  return {
    posts: data?.items as Post[],
    pagination: data?.pagination,
    search,
    setSearch,
    currentPage,
    setCurrentPage,
    isPending,
  };
}

export function useGetPost({ id }: UseGetOneByIdType) {
  const { data, isPending } = useQuery({
    queryKey: [`/posts/${id}`],
    queryFn: () => PostService.getPost(id.toString()),
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    staleTime: 60000,
    enabled: !!id,
  });

  return { post: data as Post | undefined, isPending };
} 