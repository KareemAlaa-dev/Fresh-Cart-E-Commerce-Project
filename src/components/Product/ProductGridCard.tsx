"use client"
import { Product } from '@/types'
import Image from 'next/image'
import React from 'react'
import { useWishlist } from '@/Hooks/useWishlist'
import { useRouter } from 'next/navigation'
import AddToCartBtn from '../Cart/AddToCartBtn'
import WishListButton from '../Wishlist/WishListButton'
import { memo } from 'react'

interface ProductGridCardProps {
	product: Product
}

function ProductGridCard({ product }: ProductGridCardProps) {
	const { isInWishlist, isLoading, toggleWishlist } = useWishlist(product._id);
	const router = useRouter();

	const handleCardClick = () => {
		router.push(`/products/${product.id}`);
	};

	return (
		<div 
			onClick={handleCardClick}
			className="group relative bg-white rounded-2xl flex flex-col h-full border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden cursor-pointer"
		>
			{/* Image Section */}
			<div className="relative aspect-[4/5] w-full overflow-hidden bg-slate-50">
				<Image 
					src={product.imageCover || "https://placehold.co/400x400?text=No+Image"}
					alt={product.title}
					fill
					className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
					sizes="(max-width:766px) 100vw, (max-width:1200px) 33vw, 20vw"
					loading="lazy" 
				/>

				{/* Floating Badge */}
				{product.sold > 150 && (
					<div className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md shadow-lg shadow-emerald-500/20 z-10">
						Trending
					</div>
				)}

				{/* Wishlist Action */}
				<div 
					className="absolute top-3 right-3 z-30 lg:opacity-0 lg:group-hover:opacity-100 transition-all duration-300 lg:translate-x-2 lg:group-hover:translate-x-0"
					onClick={(e) => e.stopPropagation()}
				>
					<WishListButton
						isInWishlist={isInWishlist}
						isLoading={isLoading}
						onClick={toggleWishlist}
					/>
				</div>
                
			</div>

			{/* Info Section */}
			<div className="flex flex-col flex-1 p-3 sm:p-5 pt-3 sm:pt-4">
				<div className="flex justify-between items-center mb-1">
					<span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-slate-400">
						{product.brand.name}
					</span>
					<div className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-amber-400 bg-amber-50 px-1 sm:px-1.5 py-0.5 rounded-md">
						<span className="mb-0.5">★</span>
						<span>{product.ratingsAverage}</span>
					</div>
				</div>

				<div className="mb-2 sm:mb-4 block">
					<h2 className="text-xs sm:text-sm font-semibold text-slate-800 line-clamp-2 group-hover:text-primary transition-colors min-h-[32px] sm:min-h-[40px] leading-snug">
						{product.title}
					</h2>
				</div>

				<div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-3 sm:pt-4">
					<div className="flex flex-col">
						<p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Price</p>
						<div className="flex items-baseline gap-0.5">
							<span className="text-sm sm:text-lg font-black text-slate-900">{product.price}</span>
							<span className="text-[9px] text-slate-500 font-bold uppercase">EGP</span>
						</div>
					</div>
					
					<div 
						className="flex items-center gap-2"
						onClick={(e) => e.stopPropagation()}
					>
						<AddToCartBtn productId={product._id} productQuantity={product.quantity} size="sm" />
					</div>
				</div>
			</div>
		</div>
	)
}

export default memo(ProductGridCard)