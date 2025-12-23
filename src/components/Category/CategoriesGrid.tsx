"use client";

import React from 'react';
import { Category } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CategoriesGridProps {
	categories: Category[];
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.05
		}
	}
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { 
		opacity: 1, 
		y: 0, 
		transition: { 
			type: "spring" as const, 
			stiffness: 300, 
			damping: 24 
		} 
	}
};

export default function CategoriesGrid({ categories }: CategoriesGridProps) {
	return (
		<motion.div 
			variants={container}
			initial="hidden"
			animate="show"
			className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
		>
			{categories.map((cat) => (
				<motion.div variants={item} key={cat._id}>
					<Link href={`/categories/${cat._id}`}>
						<div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 aspect-square flex flex-col items-center justify-center border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
							{/* Subtle Background Decoration */}
							<div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							
							{/* Category Image */}
							<div className="relative w-full flex-1 flex items-center justify-center z-10 mb-4">
								<div className="relative w-2/3 h-2/3"> 
									<Image
										src={cat.image}
										alt={cat.name}
										fill
										className="object-contain drop-shadow-sm group-hover:scale-110 group-hover:drop-shadow-md transition-all duration-500 ease-out"
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
									/>
								</div>
							</div>

							{/* Category Name */}
							<div className="relative z-10 text-center">
								<h3 className="text-sm sm:text-base font-bold text-slate-800 group-hover:text-emerald-600 transition-colors uppercase tracking-wide">
									{cat.name}
								</h3>
							</div>
						</div>
					</Link>
				</motion.div>
			))}
		</motion.div>
	);
}
