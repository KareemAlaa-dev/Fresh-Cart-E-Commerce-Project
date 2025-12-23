"use client"
import { getWishlist } from '@/services/api';
import { Product } from '@/types';
import { Dispatch, SetStateAction, useEffect } from 'react'
import { createContext, ReactNode, useState } from "react";
import { useSession } from "next-auth/react";

interface WishlistContextType {
	wishListCount: number;
	setWishlistCount: Dispatch<SetStateAction<number>>;
	isLoading: boolean;
	wishlistProductIds: string[];
	setWishlistProductIds: Dispatch<SetStateAction<string[]>>;
}

export const WishlistContext = createContext<WishlistContextType>({
	wishListCount: 0,
	setWishlistCount: () => { },
	isLoading: true,
	wishlistProductIds: [],
	setWishlistProductIds: () => { },
});

/**
 * Wishlist Context Provider
 * 
 * Simple, predictable implementation:
 * - Fetches wishlist when user is authenticated
 * - Caches product IDs for quick lookup
 * - Provides setters for optimistic updates
 */
export default function WishlistContextProvider({ children }: { children: ReactNode }) {
	const [wishListCount, setWishlistCount] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [wishlistProductIds, setWishlistProductIds] = useState<string[]>([])
	const { status } = useSession()

	useEffect(() => {
		// Only fetch when authenticated
		if (status !== "authenticated") {
			setIsLoading(false)
			setWishlistCount(0)
			setWishlistProductIds([])
			return
		}

		async function fetchWishlist() {
			setIsLoading(true)
			try {
				const res = await getWishlist()
				if (res?.status === "success" && res.data) {
					setWishlistCount(res.count ?? res.data.length)
					setWishlistProductIds(res.data.map((item: Product) => item._id))
				} else {
					setWishlistCount(0)
					setWishlistProductIds([])
				}
			} catch (error) {
				console.error("WishlistContext: Failed to get wishlist", error)
				setWishlistCount(0)
				setWishlistProductIds([])
			} finally {
				setIsLoading(false)
			}
		}

		fetchWishlist()
	}, [status])

	return (
		<WishlistContext.Provider value={{ 
			wishListCount, 
			setWishlistCount, 
			isLoading,
			wishlistProductIds,
			setWishlistProductIds
		}}>
			{children}
		</WishlistContext.Provider>
	)
}
