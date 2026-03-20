


export interface Category {
  _id: string ;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface CategoryData {
  data: Category[];
  pagination: Pagination;
}

export interface CategoriesApiResponse {
  status: boolean;
  message: string;
  data: CategoryData;
}

