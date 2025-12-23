"use client"
import { LucideIcon, ShoppingBag, PackageSearch, Shapes, Building2, LayoutGrid, Package, Search, Heart, ShoppingCart, Sparkles, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { ReactNode } from "react"

const iconMap = {
	packageSearch: PackageSearch,
	shapes: Shapes,
	building: Building2,
	layout: LayoutGrid,
	package: Package,
	search: Search,
	heart: Heart,
	cart: ShoppingCart
}

export type IconName = keyof typeof iconMap;

interface EmptyStateProps {
	iconName: IconName;
	title: string;
	description: string;
	ctaText?: string;
	ctaHref?: string;
	children?: ReactNode;
}

export default function EmptyState({ 
	iconName, 
	title, 
	description, 
	ctaText = "Discover Products", 
	ctaHref = "/products",
	children
}: EmptyStateProps) {
	const Icon = iconMap[iconName] || PackageSearch;

	return (
		<div className="relative min-h-[60vh] flex items-center justify-center">
			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className="relative flex flex-col items-center justify-center text-center py-12 px-4 max-w-lg mx-auto"
			>
				{/* Icon Container */}
				<div className="relative mb-8">
					{/* Main Icon Circle */}
					<motion.div 
						initial={{ scale: 0.8 }}
						animate={{ scale: 1 }}
						transition={{ 
							type: "spring",
							stiffness: 200,
							damping: 15,
							delay: 0.2
						}}
						className="relative bg-gradient-to-br from-white to-[#003c1b]/5 rounded-full p-10 sm:p-12 shadow-xl shadow-slate-200/50 border border-[#003c1b]/10"
					>
						<motion.div
							animate={{ 
								scale: [1, 1.1, 1]
							}}
							transition={{ 
								repeat: Infinity, 
								duration: 2,
								ease: "easeInOut"
							}}
						>
							<Icon className="h-16 w-16 sm:h-20 sm:w-20 text-[#003c1b]/40 stroke-[1.5]" />
						</motion.div>

						{/* Floating Sparkles Badge - Added to match empty cart style */}
						<motion.div 
							animate={{ 
								scale: [1, 1.2, 1],
								rotate: [0, 10, 0, -10, 0]
							}}
							transition={{ 
								repeat: Infinity, 
								duration: 3.5,
								ease: "easeInOut"
							}}
							className="absolute -top-2 -right-2 bg-[#003c1b] text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-[#003c1b]/30 border-2 border-white"
						>
							<Sparkles className="w-4 h-4" />
						</motion.div>

						{/* Floating Star Icon - Added to match empty cart style */}
						<motion.div 
							animate={{ 
								y: [0, -8, 0],
								rotate: [0, 180, 360]
							}}
							transition={{ 
								repeat: Infinity, 
								duration: 4,
								ease: "easeInOut",
								delay: 0.3
							}}
							className="absolute -bottom-1 -left-1 bg-white text-[#003c1b] w-7 h-7 rounded-full flex items-center justify-center shadow-lg border-2 border-[#003c1b]/10"
						>
							<Star className="w-3.5 h-3.5 fill-[#003c1b]" />
						</motion.div>
					</motion.div>
				</div>

				{/* Text Content */}
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.5 }}
				>
					<h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
						{title}
					</h2>
					<p className="text-slate-500 font-medium mb-10 leading-relaxed text-sm sm:text-base max-w-md">
						{description}
					</p>
				</motion.div>

				{/* CTA Button */}
				<motion.div
					initial={{ opacity: 0, scale: 0.9 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.4, duration: 0.5 }}
					whileHover={{ scale: 1.02 }}
					whileTap={{ scale: 0.98 }}
				>
					<Button 
						asChild 
						className="h-12 sm:h-14 px-8 sm:px-10 rounded-2xl bg-[#003c1b] hover:bg-[#003c1b]/90 text-white font-bold gap-2.5 shadow-xl shadow-[#003c1b]/20 transition-all duration-300"
					>
						<Link href={ctaHref}>
							<ShoppingBag className="w-5 h-5" />
							{ctaText}
						</Link>
					</Button>
				</motion.div>

				{/* Optional: Small Feature Hints to match wishlist/cart style */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.5 }}
					className="mt-12 flex flex-wrap gap-4 justify-center text-xs text-slate-400"
				>
					<span className="flex items-center gap-1.5">
						<div className="w-1.5 h-1.5 rounded-full bg-[#003c1b]" />
						Premium Quality
					</span>
					<span className="flex items-center gap-1.5">
						<div className="w-1.5 h-1.5 rounded-full bg-[#003c1b]" />
						Secure Shopping
					</span>
					<span className="flex items-center gap-1.5">
						<div className="w-1.5 h-1.5 rounded-full bg-[#003c1b]" />
						Fresh Selection
					</span>
				</motion.div>

				{children}
			</motion.div>
		</div>
	)
}
