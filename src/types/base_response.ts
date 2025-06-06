export type Pagination = {
  page: number;
  limit: number;
  total: number;
};

export type BaseResponse<T> = {
  code: number;
  message: string;
  data: T;
  pagination?: Pagination;
};

