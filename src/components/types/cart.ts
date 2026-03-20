export interface CartProduct {
  id: number | string;
  name: string ;
  description: string;
  price: number;
  offerPrice: number;
  size: string[];
  image: string;
  inStock: string | number;
  quantity: number;
  detailsHref?: string;
}

export interface DeliveryInfo {
  type: "home" | "office";
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  city: string;
  area: string;
  address: string;
}