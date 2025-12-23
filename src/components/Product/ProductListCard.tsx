"use client"
import { Product } from '@/types'
import Image from 'next/image'
import React from 'react'
import { useRouter } from 'next/navigation'
import { renderStars } from '@/helpers/rating'
import AddToCartBtn from '../Cart/AddToCartBtn'
import { useWishlist } from '@/Hooks/useWishlist'
import WishListButton from '../Wishlist/WishListButton'
import { motion } from 'framer-motion'

interface ProductListCardProps {
	product: Product
}

function ProductListCard({ product }: ProductListCardProps) {
	const { isInWishlist, isLoading, toggleWishlist } = useWishlist(product._id);
	const router = useRouter();

	const handleCardClick = () => {
		router.push(`/products/${product.id}`);
	};

	return (
		<motion.div 
			layout
			initial={{ opacity: 0, x: -20 }}
			animate={{ opacity: 1, x: 0 }}
			onClick={handleCardClick}
			className="group relative bg-white rounded-2xl flex flex-col md:flex-row items-stretch gap-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 overflow-hidden cursor-pointer"
		>
			{/* Product Image Section */}
			<div className="relative w-full md:w-64 aspect-[4/3] md:aspect-square overflow-hidden bg-slate-50 shrink-0">
				<Image 
					src={product.imageCover || "https://placehold.co/400x400?text=No+Image"}
					alt={product.title}
					fill
					className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
					sizes="(max-width:766px) 100vw, 300px"
				/>

				{/* Floating Badge */}
				{product.sold > 150 && (
					<div className="absolute top-4 left-4 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg shadow-emerald-500/20 z-10">
						Trending
					</div>
				)}

				<div 
					className="absolute top-4 right-4 z-30 lg:opacity-0 group-hover:opacity-100 transition-all duration-300"
					onClick={(e) => e.stopPropagation()}
				>
					<WishListButton
						isInWishlist={isInWishlist}
						isLoading={isLoading}
						onClick={toggleWishlist}
					/>
				</div>
			</div>

			{/* Product Details Section */}
			<div className="flex-1 flex flex-col p-6 md:py-8">
				<div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-2">
							<span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
								{product.brand.name}
							</span>
							<span className="w-1 h-1 rounded-full bg-slate-200" />
							<div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
								<span>★</span>
								<span>{product.ratingsAverage}</span>
								<span className="text-slate-300 ml-1">({product.ratingsQuantity})</span>
							</div>
						</div>
						<div className="block">
							<h2 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors leading-tight">
								{product.title}
							</h2>
						</div>
					</div>
					
					<div className="flex items-center gap-6 shrink-0">
						<div className="text-right">
							<p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Price</p>
							<div className="flex items-baseline justify-end gap-1">
								<span className="text-2xl font-black text-slate-900">{product.price}</span>
								<span className="text-xs text-slate-500 font-bold uppercase">EGP</span>
							</div>
						</div>
					</div>
				</div>

				<p className="text-slate-500 text-sm line-clamp-2 mb-6 max-w-2xl">
					{product.description}
				</p>

				<div 
					className="w-fit mb-8"
					onClick={(e) => e.stopPropagation()}
				>
					<AddToCartBtn productId={product._id} productQuantity={product.quantity} />
				</div>

				<div className="flex items-center justify-between border-t border-slate-50 pt-6 mt-auto">
					<div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
						</span>
						In Stock - Fast Delivery
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default React.memo(ProductListCard)