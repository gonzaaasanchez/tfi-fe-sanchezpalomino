export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
}
