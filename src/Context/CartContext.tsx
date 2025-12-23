"use client"
import { getUserCart } from '@/services/api';
import React, { Dispatch, SetStateAction, useEffect } from 'react'
import { createContext, ReactNode, useState } from "react";
import { useSession } from "next-auth/react";

interface CartContextType {
	cartCount: number;
	setCartCount: Dispatch<SetStateAction<number>>;
	isLoading: boolean;
}

export const cartContext = createContext<CartContextType>({
	cartCount: 0,
	setCartCount: () => { },
	isLoading: true,
});

/**
 * Cart Context Provider
 * 
 * Simple, predictable implementation:
 * - Fetches cart count when user is authenticated
 * - Provides setCartCount for optimistic updates
 */
export default function CartContextProvider({ children }: { children: ReactNode }) {
	const [cartCount, setCartCount] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const { status } = useSession()

	useEffect(() => {
		// Only fetch when authenticated
		if (status !== "authenticated") {
			setIsLoading(false)
			setCartCount(0)
			return
		}

		async function fetchCart() {
			setIsLoading(true)
			try {
				const res = await getUserCart()
				if (res?.status === "success") {
					setCartCount(res.numOfCartItems)
				} else {
					setCartCount(0)
				}
			} catch (error) {
				console.error("CartContext: Failed to get cart", error)
				setCartCount(0)
			} finally {
				setIsLoading(false)
			}
		}

		fetchCart()
	}, [status])

	return (
		<cartContext.Provider value={{ cartCount, setCartCount, isLoading }}>
			{children}
		</cartContext.Provider>
	)
}
