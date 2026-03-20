

import { CartProduct, DeliveryInfo } from "@/components/types/cart";

const CART_KEY = "product_cart";
const DELIVERY_KEY = "product_delivery_info";

export function getCartFromStorage(): CartProduct[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartProduct[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function clearCartStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

export function getDeliveryInfoFromStorage(): DeliveryInfo | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DELIVERY_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveDeliveryInfoToStorage(data: DeliveryInfo) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DELIVERY_KEY, JSON.stringify(data));
}

export function clearDeliveryInfoStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(DELIVERY_KEY);
}