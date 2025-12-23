"use client"

import React from 'react'
import { Button } from '../ui/button'
import { Heart, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface WishListButtonProps {
	isInWishlist: boolean
	isLoading: boolean
	onClick: () => void
	className?: string
}

/**
 * Wishlist Toggle Button
 * 
 * Simple, clean implementation:
 * - Receives all state from parent (useWishlist hook)
 * - Single responsibility: just renders the button
 */
export default function WishListButton({ isInWishlist, isLoading, onClick, className }: WishListButtonProps) {
	return (
		<motion.div
			whileHover={{ scale: 1.1 }}
			whileTap={{ scale: 0.9 }}
		>
			<Button 
				onClick={onClick}
				disabled={isLoading}
				size="icon"
				variant="ghost"
				className={cn(
					"rounded-full bg-white/80 backdrop-blur-md shadow-sm border border-white/20 transition-all duration-300",
					isInWishlist ? "text-red-500 hover:bg-red-50" : "text-muted-foreground hover:bg-white",
					className
				)} 
				aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
			>
				{isLoading ? (
					<Loader2 className="h-5 w-5 animate-spin" />
				) : (
					<AnimatePresence mode="wait">
						<motion.div
							key={isInWishlist ? "active" : "inactive"}
							initial={{ scale: 0.5, opacity: 0 }}
							animate={{ scale: 1, opacity: 1 }}
							exit={{ scale: 0.5, opacity: 0 }}
							transition={{ type: "spring", stiffness: 400, damping: 10 }}
						>
							<Heart className="h-5 w-5" fill={isInWishlist ? "currentColor" : "none"} />
						</motion.div>
					</AnimatePresence>
				)}
			</Button>
		</motion.div>
	)
}
