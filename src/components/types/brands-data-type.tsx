

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
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

export interface BrandData {
  data: Brand[];
  pagination: Pagination;
}

export interface BrandsApiResponse {
  status: boolean;
  message: string;
  data: BrandData;
}