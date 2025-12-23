"use client"

import { useState, useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { addToWishlist, removeFromWishlist } from "@/services/api";
import { useSession } from "next-auth/react";
import { WishlistContext } from "@/Context/WishListContext";

/**
 * useWishlist Hook
 * 
 * Simple, clean implementation:
 * - Uses context for initial state
 * - Manages its own loading state
 * - Proper optimistic updates with rollback
 */
export function useWishlist(productId: string) {
	const { 
		wishlistProductIds, 
		setWishlistProductIds,
		setWishlistCount 
	} = useContext(WishlistContext);
	
	const { status } = useSession();
	const [isLoading, setIsLoading] = useState(false);
	
	// Check if product is in wishlist
	const isInWishlist = wishlistProductIds.includes(productId);

	async function toggleWishlist() {
		// Prevent double-clicks
		if (isLoading) return;

		// Auth check
		if (status !== "authenticated") {
			toast.error("You must be logged in to manage wishlist.");
			return;
		}

		// Start loading
		setIsLoading(true);
		
		// Store current state for rollback
		const wasInWishlist = isInWishlist;
		const originalIds = [...wishlistProductIds];
		
		// Optimistic update
		if (wasInWishlist) {
			setWishlistProductIds(prev => prev.filter(id => id !== productId));
			setWishlistCount(prev => Math.max(0, prev - 1));
		} else {
			setWishlistProductIds(prev => [...prev, productId]);
			setWishlistCount(prev => prev + 1);
		}
		
		// Show loading toast
		const toastId = toast.loading(wasInWishlist ? "Removing..." : "Adding...");

		try {
			const action = wasInWishlist ? removeFromWishlist : addToWishlist;
			const res = await action(productId);

			if (res.status === "success") {
				toast.success(wasInWishlist ? "Removed from wishlist" : "Added to wishlist", { id: toastId });
			} else {
				// Rollback on failure
				setWishlistProductIds(originalIds);
				setWishlistCount(originalIds.length);
				toast.error("Action failed. Please try again.", { id: toastId });
			}
		} catch (error) {
			console.error("Wishlist error:", error);
			// Rollback on error
			setWishlistProductIds(originalIds);
			setWishlistCount(originalIds.length);
			toast.error("Something went wrong. Please try again.", { id: toastId });
		} finally {
			setIsLoading(false);
		}
	}

	return { isInWishlist, isLoading, toggleWishlist };
}
