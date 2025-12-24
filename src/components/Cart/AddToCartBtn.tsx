"use client"

import React, { useContext, useState } from 'react'
import { Button } from '../ui/button'
import { Loader2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { addToCart, updateCartProductQuantity } from '@/services/api'
import { cartContext } from '@/Context/CartContext'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AddToCartBtnProps {
	productQuantity?: number | null // Stock quantity
	productId: string
	size?: "default" | "sm"
	countToAdd?: number // Quantity user wants to add (default 1)
}

/**
 * Add to Cart Button
 * 
 * Simple, clean implementation:
 * - Single loading state
 * - Optimistic UI update
 * - Proper error handling with rollback
 */
export default function AddToCartBtn({ productQuantity, productId, size = "default", countToAdd = 1 }: AddToCartBtnProps) {
	const [isLoading, setIsLoading] = useState(false)
	const { status } = useSession()
	const { cartCount, setCartCount } = useContext(cartContext)

	async function handleAddToCart() {
		// Prevent double-clicks
		if (isLoading) return

		// Auth check
		if (status === "unauthenticated") {
			toast.error("Please login to add items to your cart")
			return
		}

		// Start loading
		setIsLoading(true)
		
		// Save original count for rollback
		const originalCount = cartCount
		
		// Optimistic update
		setCartCount(prev => prev + countToAdd)
		
		// Show loading toast
		const toastId = toast.loading("Adding to cart...")

		try {
			// Step 1: Add item to cart (adds 1)
			const data = await addToCart(productId)
			
			if (data?.status === 'success') {
				
				// Keep track of the final cart items count to update context
				let finalNumOfCartItems = data.numOfCartItems;

				// Step 2: If user wanted to add more than 1, update the quantity
				if (countToAdd > 1) {
					// Find the product in the cart to get its *current* server quantity
					// data.data.products is CartProduct<string>[] (where product is the ID)
					const cartItem = data.data.products.find((item: any) => item.product === productId);

					if (cartItem) {
						// Calculate target quantity:
						// We added 1. We wanted to add N.
						// So we need to add (N - 1) more to the current total.
						// Target = current + (N - 1)
						const targetCount = cartItem.count + (countToAdd - 1);

						const updateData = await updateCartProductQuantity(productId, targetCount);

						if (updateData?.status === 'success') {
							finalNumOfCartItems = updateData.numOfCartItems;
							toast.success(`Added ${countToAdd} items to cart!`, { id: toastId });
						} else {
							// Update failed but add succeeded (user has +1)
							toast.success("Added 1 item to cart (could not update quantity).", { id: toastId });
						}
					} else {
						// Should not happen if add was successful
						toast.success("Added to cart!", { id: toastId });
					}
				} else {
					// Just adding 1
					toast.success("Added to cart!", { id: toastId });
				}

				// Sync global state with final server source of truth
				setCartCount(finalNumOfCartItems);

			} else {
				// Failed - rollback
				setCartCount(originalCount)
				toast.error(data?.message || "Failed to add product.", { id: toastId })
			}
		} catch (error) {
			// Error - rollback
			console.error("Add to cart error:", error)
			setCartCount(originalCount)
			toast.error("Something went wrong. Please try again.", { id: toastId })
		} finally {
			setIsLoading(false)
		}
	}

	const isDisabled = isLoading || productQuantity === 0

	return (
		<motion.div whileTap={{ scale: 0.95 }}>
			<Button 
				onClick={handleAddToCart}
				disabled={isDisabled}
				className={cn(
					"rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase shadow-sm transition-all duration-300",
					size === "sm" 
						? "h-8 sm:h-9 px-2 sm:px-3 text-[8px] sm:text-[9px] tracking-wide gap-1 sm:gap-1.5" 
						: "h-10 sm:h-11 px-4 sm:px-6 text-[9px] sm:text-[10px] tracking-wider gap-1.5 sm:gap-2",
					isLoading && "opacity-80"
				)}
			>
				{isLoading ? (
					<Loader2 className={cn("animate-spin", size === "sm" ? "h-2.5 w-2.5 sm:h-3 sm:w-3" : "h-3 w-3 sm:h-3.5 sm:w-3.5")} />
				) : (
					<Plus className={cn(size === "sm" ? "h-2.5 w-2.5 sm:h-3 sm:w-3" : "h-3 w-3 sm:h-3.5 sm:w-3.5")} />
				)}
				<span>{isLoading ? "Adding" : "Add to Cart"}</span>
			</Button>
		</motion.div>
	)
}
