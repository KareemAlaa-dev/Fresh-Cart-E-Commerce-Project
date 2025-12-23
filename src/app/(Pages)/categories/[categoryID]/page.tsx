import { Category, Product } from "@/types"
import ProductCard from "@/components/Product/ProductCard"
import ProductGrid from "@/components/shared/ProductGrid"
import { getSingleCategory, getSingleCategoryAllProducts } from "@/services/api"
import { ProductResponse } from "@/types"
import { Metadata } from "next"
import EmptyState from "@/components/shared/EmptyState"
import { Shapes } from "lucide-react"


export async function generateMetadata({
	params,
}: {
	params: Promise<{ categoryID: string }>;
}): Promise<Metadata> {
	try {
		const { categoryID } = await params;
		const CategoryData = await getSingleCategory(categoryID);
		const category: Category = CategoryData.data;

		return {
			title: `${category.name} Products | FreshCart`,
			description: `Browse and shop the latest products from ${category.name}.`,
			openGraph: {
				title: `${category.name} Products | FreshCart`,
				description: `Discover top products from ${category.name}.`,
				url: `/categories/${categoryID}`,
			},
			twitter: {
				card: "summary_large_image",
				title: `${category.name} Products`,
				description: `Discover top products from ${category.name}.`,
			},
		};
	} catch {
		return {
			title: "Category Products",
			description: "Browse products for this category.",
		};
	}
}

export default async function SingleCategoryProductsPage({
	params,
}: {
	params: Promise<{ categoryID: string }>
}) {


	// subcategory
	const { categoryID } = await params;
	const data: ProductResponse = await getSingleCategoryAllProducts(categoryID)
	const products: Product[] = data?.data || []


	// // Fetch single cat details

	const CategoryData = await getSingleCategory(categoryID)
	const category: Category = CategoryData?.data


	return (

		<main className="min-h-screen pb-24 bg-slate-50/50">
			{/* Page Header */}
			<div className="pt-12 pb-8 mb-6 sm:mb-12 text-center sm:text-left">
				<div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
					<h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">
						{category?.name} <span className="text-[#003c1b] italic font-serif">Category</span>
					</h1>
					{products?.length > 0 && (
						<p className="text-xs sm:text-base text-slate-500 font-medium">
							Explore the best selection in {category?.name}.
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
						iconName="shapes"
						title="Category is currently empty"
						description={`We're currently restocking our ${category?.name} catalog. please explore our other categories in the meantime.`}
						ctaText="Browse Other Categories"
						ctaHref="/categories"
					/>
				)}
			</div>
		</main>

	)
}
