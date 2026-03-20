export interface Category {
  _id: string;
  name: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Brand {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
  _id: string;
  name: string;
  weight: string;
  size: string[];
  price: number;
  offerPrice: number;
  stock: number;
  category: Category;
  brand: Brand;
  description: string;
  image: string;
  subImages: string[];
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
//   orders: any[];
  totalSold: number;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalData: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductData {
  data: Product[];
  pagination: Pagination;
}

export interface AllProductsApiResponse {
  status: boolean;
  message: string;
  data: ProductData;
}