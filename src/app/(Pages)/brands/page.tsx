import { Brand } from "@/types"
import { getAllBrands } from "@/services/api"
import { BrandResponse } from "@/types"
import BrandsGrid from "@/components/Brands/BrandsGrid"
import { Metadata } from "next";
import EmptyState from "@/components/shared/EmptyState";
import { Building2 } from "lucide-react";

export const metadata: Metadata = {
	title: "Browse Brands | FreshCart",
	description: "Discover our premium selection of trusted partners and brands.",
};

export default async function BrandsPage() {
	const data: BrandResponse = await getAllBrands()
	const brands: Brand[] = data?.data || []

	return (
		<main className="min-h-screen bg-slate-50/50 py-12 sm:py-20">
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="mb-12 sm:mb-16 text-center max-w-2xl mx-auto">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
						Premium Partners
					</h1>
					<p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
						Explore our curated collection of world-class brands known for quality, sustainability, and freshness.
					</p>
				</div>

				{/* Animated Grid */}
				{brands.length > 0 ? (
					<BrandsGrid brands={brands} />
				) : (
					<EmptyState 
						iconName="building"
						title="No Brands Found"
						description="We're currently updating our partner list. Please check back later to discover our premium selection."
						ctaText="Back to Shop"
						ctaHref="/"
					/>
				)}
			</section>
		</main>
	)
}
