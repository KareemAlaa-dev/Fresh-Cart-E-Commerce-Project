"use client"
import { Package } from "lucide-react"
import EmptyState from "@/components/shared/EmptyState";

export default function EmptyOrders() {
	return (
		<EmptyState 
			iconName="package"
			title="No orders yet"
			description="You haven’t placed any orders yet. Once you make your first purchase, you’ll be able to track its progress right here!"
			ctaText="Start Shopping"
			ctaHref="/products"
		/>
	)
}
