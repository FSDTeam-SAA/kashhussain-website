"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  clearCartStorage,
  clearDeliveryInfoStorage,
  getCartFromStorage,
  getDeliveryInfoFromStorage,
  saveCartToStorage,
  saveDeliveryInfoToStorage,
} from "@/lib/cart-storage";
import { toast } from "sonner";
import { CartProduct, DeliveryInfo } from "../types/cart";

type AddToCartPayload = Omit<CartProduct, "quantity"> & { quantity?: number };

interface CartContextType {
  cartItems: CartProduct[];
  cartCount: number;
  subtotal: number;
  deliveryInfo: DeliveryInfo | null;
  addToCart: (product: AddToCartPayload) => void;
  removeFromCart: (id: number | string) => void;
  incrementQuantity: (id: number | string) => void;
  decrementQuantity: (id: number | string) => void;
  updateQuantity: (id: number | string, quantity: number) => void;
  clearCart: () => void;
  saveDeliveryInfo: (data: DeliveryInfo) => void;
  clearOrderData: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setCartItems(getCartFromStorage());
    setDeliveryInfo(getDeliveryInfoFromStorage());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    saveCartToStorage(cartItems);
  }, [cartItems, isLoaded]);

  const addToCart = (product: AddToCartPayload) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        toast.success("Quantity updated in cart");
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + (product.quantity ?? 1) }
            : item
        );
      }

      toast.success("Product added to cart");
      return [...prev, { ...product, quantity: product.quantity ?? 1 }];
    });
  };

  const removeFromCart = (id: number | string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    toast.success("Product removed");
  };

  const incrementQuantity = (id: number | string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decrementQuantity = (id: number | string) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity - 1) }
            : item
        )
    );
  };

  const updateQuantity = (id: number | string, quantity: number) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    clearCartStorage();
  };

  const saveDeliveryInfo = (data: DeliveryInfo) => {
    setDeliveryInfo(data);
    saveDeliveryInfoToStorage(data);
  };

  const clearOrderData = () => {
    setCartItems([]);
    setDeliveryInfo(null);
    clearCartStorage();
    clearDeliveryInfoStorage();
  };

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item?.offerPrice * item?.quantity, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        deliveryInfo,
        addToCart,
        removeFromCart,
        incrementQuantity,
        decrementQuantity,
        updateQuantity,
        clearCart,
        saveDeliveryInfo,
        clearOrderData,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return context;
}