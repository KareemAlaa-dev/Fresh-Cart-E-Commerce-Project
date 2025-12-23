"use client"
import EmptyState from "@/components/shared/EmptyState"

export default function EmptyWishlist() {
	return (
		<EmptyState 
			iconName="heart"
			title="Your wishlist is empty"
			description="Save your favorite items here and never lose track of what you love. Start building your collection today!"
			ctaText="Discover Products"
			ctaHref="/products"
		/>
	)
}
