"use client";

import React from 'react';
import { Brand } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface BrandsGridProps {
	brands: Brand[];
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

export default function BrandsGrid({ brands }: BrandsGridProps) {
	return (
		<motion.div 
			variants={container}
			initial="hidden"
			animate="show"
			className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8"
		>
			{brands.map((brand) => (
				<motion.div variants={item} key={brand._id}>
					<Link href={`/brands/${brand._id || brand.slug || '#'}`}>
						<div className="group relative bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 aspect-square flex items-center justify-center border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer">
							{/* Subtle Background Decoration */}
							<div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
							
							{/* Brand Image with Motion */}
							<div className="relative w-full h-full p-4 sm:p-6 flex items-center justify-center z-10">
								<div className="relative w-full h-full"> 
									<Image
										src={brand.image}
										alt={brand.name}
										fill
										className="object-contain drop-shadow-sm group-hover:scale-110 group-hover:drop-shadow-md transition-all duration-500 ease-out"
										sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
									/>
								</div>
							</div>

							{/* Optional: Hover Name Appear Effect (Future Enhancement) */}
							{/* <div className="absolute bottom-4 left-0 right-0 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
								<span className="text-xs font-bold uppercase tracking-widest text-slate-400">{brand.name}</span>
							</div> */}
						</div>
					</Link>
				</motion.div>
			))}
		</motion.div>
	);
}
