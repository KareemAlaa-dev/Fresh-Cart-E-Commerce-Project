import { Brand, Product } from "@/types";
import ProductCard from "@/components/Product/ProductCard";
import { getSingleBrand, getSingleBrandAllProducts } from "@/services/api";
import { ProductResponse } from "@/types";
import { Metadata } from "next";
import EmptyState from "@/components/shared/EmptyState";
import { PackageSearch } from "lucide-react";
import ProductGrid from "@/components/shared/ProductGrid";


export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	try {
		const param = await params
		const barndID = param.id
		const brandData = await getSingleBrand(barndID);
		const brand: Brand = brandData.data;

		return {
			title: `${brand.name} Products | FreshCart`,
			description: `Browse and shop the latest products from ${brand.name}.`,
		};
	} catch {
		return {
			title: "Brand Products",
			description: "Browse products for this brand.",
		};
	}
}


export default async function BrandProductsPage({
	params,
}: {
	params: Promise<{ id: string }>
}) {
	const { id } = await params

	// Fetch products
	const data: ProductResponse = await getSingleBrandAllProducts(id);
	const products: Product[] = data?.data || [];

	// Fetch brand details
	const brandData = await getSingleBrand(id);
	const brand: Brand = brandData?.data;

	return (
		<main className="min-h-screen pb-24 bg-slate-50/50">
			{/* Page Header */}
			<div className="pt-12 pb-8 mb-6 sm:mb-12 text-center sm:text-left">
				<div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
					<h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
						{brand?.name} <span className="text-[#003c1b] italic font-serif">Collection</span>
					</h1>
					{products?.length > 0 && (
						<p className="text-xs sm:text-base text-slate-500 font-medium">
							Explore the finest selection from {brand?.name}.
						</p>
					)}
				</div>
			</div>

			<div className="max-w-screen-2xl mx-auto px-3 sm:px-6">
				{products?.length > 0 ? (
					<div className="flex flex-col gap-6">
						<p className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-2">
							{products.length} {products.length === 1 ? 'Product' : 'Products'} Found
						</p>
						<ProductGrid>
							{products.map((product) => (
								<ProductCard key={product._id} product={product} viewMode="grid" />
							))}
						</ProductGrid>
					</div>
				) : (
					<EmptyState 
						iconName="packageSearch"
						title="No products available"
						description={`We couldn't find any products in the ${brand?.name} collection right now. Please check back later or explore other brands.`}
						ctaText="Browse Other Brands"
						ctaHref="/brands"
					/>
				)}
			</div>
		</main>
	);
}
