"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Product } from "@/types";
import { Star, Minus, Plus, ChevronLeft, ChevronRight, ShoppingBag, Truck, ShieldCheck, BadgeCheck } from "lucide-react";
import { Button } from "../ui/button";
import AddToCartBtn from "../Cart/AddToCartBtn";
import Image from "next/image";
import { useWishlist } from "@/Hooks/useWishlist";
import WishListButton from "../Wishlist/WishListButton";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailPage({ productData }: { productData: Product }) {
	const [mainIndex, setMainIndex] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const { isInWishlist, isLoading, toggleWishlist } = useWishlist(productData._id);

	const product = productData;

	const nextImage = useCallback(() => {
		if (product?.images?.length > 0) {
			setMainIndex((prev) => (prev + 1) % product.images.length);
		}
	}, [product?.images?.length]);

	const prevImage = useCallback(() => {
		if (product?.images?.length > 0) {
			setMainIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
		}
	}, [product?.images?.length]);

	useEffect(() => {
		const interval = setInterval(nextImage, 7000); 
		return () => clearInterval(interval);
	}, [nextImage]);

	return (
		<main className="min-h-screen bg-white sm:bg-slate-50/50 pb-12 sm:pb-20 pt-0 sm:pt-8 transition-colors duration-500">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start lg:pt-8">
					
					{/* LEFT COLUMN: Visuals */}
					<div className="flex flex-col space-y-6 lg:sticky lg:top-24">
						{/* Main Image Stage */}
						<div className="relative w-full aspect-[4/3] sm:aspect-square bg-slate-50 sm:bg-white rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden sm:shadow-sm sm:border border-slate-100 group">
							{/* Wishlist Toggle (Float Top Right) - Visible Background Added */}
							<div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20">
								<WishListButton
									isInWishlist={isInWishlist}
									isLoading={isLoading}
									onClick={toggleWishlist}
									className="bg-white/90 backdrop-blur-md shadow-sm border border-slate-200/50 text-slate-500 hover:text-red-500 hover:bg-white transition-all h-9 w-9 sm:h-10 sm:w-10 !p-0"
								/>
							</div>

							{/* Image Container */}
							<div className="relative w-full h-full flex items-center justify-center p-6 sm:p-12">
								<AnimatePresence mode="wait">
									<motion.div
										key={mainIndex}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ duration: 0.3 }}
										className="relative w-full h-full"
									>
										<Image
											src={product?.images[mainIndex]}
											alt={product?.title}
											fill
											className="object-contain"
											priority
										/>
									</motion.div>
								</AnimatePresence>
							</div>

							{/* Navigation Arrows (Visible on Mobile) */}
							<div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between items-center pointer-events-none opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
								<button 
									onClick={(e) => { e.stopPropagation(); prevImage(); }}
									className="pointer-events-auto h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm border border-slate-200/50 hover:scale-110 transition-all text-slate-700"
								>
									<ChevronLeft size={18} />
								</button>
								<button 
									onClick={(e) => { e.stopPropagation(); nextImage(); }}
									className="pointer-events-auto h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm border border-slate-200/50 hover:scale-110 transition-all text-slate-700"
								>
									<ChevronRight size={18} />
								</button>
							</div>
						</div>

						{/* Thumbnails: Centered & Clean */}
						<div className="flex justify-center items-center gap-3 overflow-x-auto py-2 no-scrollbar">
							{product?.images.map((src, i) => (
								<button
									key={i}
									onClick={() => setMainIndex(i)}
									className={cn(
										"relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden transition-all duration-300 shrink-0",
										i === mainIndex 
											? "ring-2 ring-emerald-500 ring-offset-2 scale-100 opacity-100" 
											: "opacity-50 hover:opacity-100 hover:scale-105"
									)}
								>
									<Image src={src} alt={`View ${i + 1}`} fill className="object-cover bg-white" />
								</button>
							))}
						</div>
					</div>

					{/* RIGHT COLUMN: Product DNA */}
					<div className="flex flex-col pt-2 sm:pt-4">
						
						{/* Header: Brand & Rating */}
						<div className="flex items-center justify-between mb-4 sm:mb-6">
							<div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50/80 text-emerald-700 text-[10px] font-black uppercase tracking-widest border border-emerald-100/50">
								<BadgeCheck size={14} className="fill-emerald-200/50" />
								{product.brand?.name}
							</div>
							<div className="flex items-center gap-1.5 text-amber-500 text-sm font-bold">
								<Star size={16} fill="currentColor" strokeWidth={0} />
								<span>{product.ratingsAverage}</span>
								<span className="text-slate-300 text-xs font-normal">({product.ratingsQuantity})</span>
							</div>
						</div>

						{/* Title & Price */}
						<h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-6 flex flex-wrap items-end gap-3">
							{product.title}
							<div className="flex items-baseline gap-1 ml-auto sm:ml-0">
								<span className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tighter">
									{(product.price * quantity).toLocaleString()}
								</span>
								<span className="text-sm font-bold text-slate-400 uppercase">EGP</span>
							</div>
						</h1>

						{/* Description */}
						<div className="space-y-4 mb-6 sm:mb-10">
							<h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Description</h3>
							<p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed max-w-2xl">
								{product.description}
							</p>
						</div>

						{/* Action Hub - Centered & Balanced on Mobile */}
						<div className="flex flex-col sm:flex-row gap-4 sm:items-center mb-10 w-full">
							{/* Quantity Pill - Expanded Width */}
							<div className="flex items-center justify-between sm:justify-center bg-slate-100 rounded-2xl p-1.5 w-full sm:w-auto min-w-[140px] sm:min-w-[160px]">
								<button 
									onClick={() => setQuantity(q => Math.max(1, q - 1))}
									disabled={quantity <= 1}
									className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm hover:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 touch-manipulation"
								>
									<Minus size={18} />
								</button>
								<span className="font-bold text-xl text-slate-900 w-12 text-center">{quantity}</span>
								<button 
									onClick={() => setQuantity(q => q + 1)}
									className="w-12 h-12 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm hover:scale-95 transition-all touch-manipulation"
								>
									<Plus size={18} />
								</button>
							</div>

							{/* Add To Cart - Centered & Balanced */}
							<div className="w-full sm:flex-1">
								<div className="w-full flex justify-center sm:justify-start">
									<AddToCartBtn 
										productId={product._id} 
										productQuantity={product.quantity} 
										countToAdd={quantity}
										size="default" 
									/>
								</div>
							</div>
						</div>

						{/* Trust Grid */}
						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
								<div className="p-2 bg-white rounded-full shadow-sm text-emerald-600">
									<Truck size={18} />
								</div>
								<div className="flex flex-col">
									<span className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Fast Delivery</span>
									<span className="text-[10px] font-medium text-slate-400">Within 24 Hours</span>
								</div>
							</div>
							<div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
								<div className="p-2 bg-white rounded-full shadow-sm text-blue-600">
									<ShieldCheck size={18} />
								</div>
								<div className="flex flex-col">
									<span className="text-[10px] font-black uppercase text-slate-900 tracking-wider">Genuine</span>
									<span className="text-[10px] font-medium text-slate-400">100% Verified</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

