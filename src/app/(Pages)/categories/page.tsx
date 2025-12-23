import { Category } from "@/types";
import { getAllCategories } from "@/services/api";
import { CategoryResponse } from "@/types";
import { Metadata } from "next";
import CategoriesGrid from "@/components/Category/CategoriesGrid";
import EmptyState from "@/components/shared/EmptyState";
import { LayoutGrid } from "lucide-react";

export const metadata: Metadata = {
	title: "Browse Categories | FreshCart",
	description: "Explore all product categories and subcategories.",
};

export default async function BrowseByCategory() {
	const catRes: CategoryResponse = await getAllCategories();
	const categories: Category[] = catRes?.data || []

	return (
		<main className="min-h-screen bg-slate-50/50 py-12 sm:py-20">
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header Section - Aligned with Brands Page */}
				<div className="mb-12 sm:mb-16 text-center max-w-2xl mx-auto">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
						Explore Categories
					</h1>
					<p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed">
						Browse our wide selection of fresh products, organized for your convenience.
					</p>
				</div>

				{/* Animated Grid */}
				{categories.length > 0 ? (
					<CategoriesGrid categories={categories} />
				) : (
					<EmptyState 
						iconName="layout"
						title="No Categories Available"
						description="We're currently organizing our fresh catalog. Please check back shortly to explore our full range of products."
						ctaText="Back to Shop"
						ctaHref="/"
					/>
				)}
			</section>
		</main>
	);
}
