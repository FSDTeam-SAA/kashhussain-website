"use client"
import React from 'react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CartProvider } from '../context/cart-context';

const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    return (
        <div>
            <QueryClientProvider client={queryClient}>
                {/* {children} */}
                 <CartProvider>{children}</CartProvider>
            </QueryClientProvider>
        </div>
    )
}

export default AppProvider