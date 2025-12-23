"use client"
import React, { useState, Suspense } from 'react'
import { Search } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"
import EmptyState from '../shared/EmptyState'
import LoadingSpinner from '../shared/LoadingSpinner'
import useProducts from '@/Hooks/useProducts'
import Searchbar from '../Searchbar'
import Viewmode from '../Viewmode'
import Sidebar from '../Sidebar'
import ProductGrid from '../shared/ProductGrid'

const ProductCard = React.lazy(() => import("./ProductCard"))

export default function ProductGridContainer() {
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
	const { state, dispatch } = useProducts()

	if (state.loading) return <LoadingSpinner />

	return (
		<main className="min-h-screen pb-24 bg-slate-50/50">
			{/* Modern Page Header */}
			<div className="pt-8 sm:pt-12 pb-4 sm:pb-8 mb-6 sm:mb-12 text-center sm:text-left">
				<div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
					<h1 className="text-2xl sm:text-4xl font-black text-slate-900 mb-2">Our Products</h1>
					<p className="text-xs sm:text-base text-slate-500 font-medium">Explore our curated collection of fresh basics.</p>
				</div>
			</div>

			<div className="max-w-screen-2xl mx-auto px-3 sm:px-6">
				<div className="flex flex-col lg:flex-row gap-12">
					{/* Sidebar - Clean & Modern */}
					<div className="w-full lg:w-64 shrink-0">
						<div className="sticky top-28 space-y-8">
							<Sidebar dispatch={dispatch} activeCategory={state.categoryFilter} products={state.products} />
						</div>
					</div>

					{/* Main Content Area */}
					<div className="flex-1">
						{/* Clean Interaction Bar */}
						<div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-3 sm:p-4 mb-6 sm:mb-10 flex flex-col md:flex-row items-center gap-4 shadow-sm">
							<div className="flex-1 w-full">
								<Searchbar dispatch={dispatch} />
							</div>
							<div className="flex items-center gap-4 border-l border-slate-100 pl-4 hidden md:flex">
								<Viewmode viewMode={viewMode} setViewMode={setViewMode} />
							</div>
						</div>

						<AnimatePresence mode="wait">
							{state.filtered.length === 0 ? (
								<EmptyState 
									iconName="search"
									title="No matching products"
									description="We couldn't find anything matching your filters or search query. Try clearing some selections or using different keywords!"
									ctaText="Clear All Filters"
									ctaHref="/products"
								/>
							) : (
								<ProductGrid viewMode={viewMode}>
									{state.filtered.map((product) => (
										<Suspense 
											key={product._id}
											fallback={<div className="aspect-[4/5] rounded-2xl bg-slate-100 animate-pulse" />}
										>
											<ProductCard product={product} viewMode={viewMode} />
										</Suspense>
									))}
								</ProductGrid>
							)}
						</AnimatePresence>
					</div>
				</div>
			</div>
		</main>
	)
}
