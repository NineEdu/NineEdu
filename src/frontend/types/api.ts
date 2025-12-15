export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  [key: string]: any; // Các filter khác
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
