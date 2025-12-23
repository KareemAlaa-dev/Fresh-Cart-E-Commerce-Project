"use client"
import EmptyState from "@/components/shared/EmptyState"

export default function EmptyCart() {
	return (
		<EmptyState 
			iconName="cart"
			title="Your cart is empty"
			description="Looks like you haven't added any items yet. Start exploring our fresh collection and discover premium organic products!"
			ctaText="Continue Shopping"
			ctaHref="/products"
		/>
	)
}
