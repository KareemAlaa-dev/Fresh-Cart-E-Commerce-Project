"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Leaf, ShieldCheck, Truck, Zap } from 'lucide-react'

const features = [
	{
		icon: Leaf,
		title: "Pure Organic",
		description: "100% certified organic products sourced directly from local sustainable farms.",
		color: "bg-emerald-500"
	},
	{
		icon: Zap,
		title: "Express Delivery",
		description: "Get your groceries delivered to your doorstep in under 60 minutes, guaranteed.",
		color: "bg-amber-500"
	},
	{
		icon: ShieldCheck,
		title: "Premium Quality",
		description: "Every item undergoes rigorous quality checks to ensure you get only the best.",
		color: "bg-blue-500"
	},
	{
		icon: Truck,
		title: "Ecofriendly Fleet",
		description: "Your orders are delivered using our 100% electric and carbon-neutral fleet.",
		color: "bg-primary"
	}
]

export default function Features() {
	return (
		<section className="py-8 sm:py-16 px-4 sm:px-6 bg-accent/5 overflow-hidden">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 pb-8">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 30 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.5, delay: index * 0.1 }}
							className="group h-full p-6 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] bg-white border border-white/20 shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-500"
						>
							<div className={`w-12 h-12 sm:w-14 sm:h-14 ${feature.color} rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6 shadow-md rotate-3 group-hover:rotate-12 transition-transform duration-500`}>
								<feature.icon size={24} className="sm:w-[28px] sm:h-[28px]" />
							</div>
							<h3 className="text-lg sm:text-xl font-black text-foreground mb-2 sm:mb-3">{feature.title}</h3>
							<p className="text-muted-foreground text-sm leading-relaxed">
								{feature.description}
							</p>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
