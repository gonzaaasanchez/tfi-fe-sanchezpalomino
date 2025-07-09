export type UseGetAllType = {
  initialSearch?: string;
  limit?: number;
  page?: number;
  sort?: string;
  search?: string;
  courseId?: number;
};

export type UseGetOneByIdType = {
  id: number;
  enabled?: boolean;
};
