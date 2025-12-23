"use client"

import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { ArrowRight, ScanLine, Smartphone, Zap } from 'lucide-react'
import Link from 'next/link'

export default function SmartShowcase() {
	const containerRef = React.useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({
		target: containerRef,
		offset: ["start end", "end start"]
	})

	const y = useTransform(scrollYProgress, [0, 1], [100, -100])
	const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])

	return (
		<section ref={containerRef} className="hidden md:block py-12 lg:py-24 px-4 sm:px-6 overflow-hidden">
			<div className="max-w-7xl mx-auto">
				<div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-black text-white isolate">
					{/* Background Image with Parallax */}
					<div className="absolute inset-0 -z-10">
						<motion.div style={{ y }} className="relative w-full h-[120%] -top-[10%]">
							<Image
								src="/images/grocery-banner.png"
								alt="Smart Grocery Technology"
								fill
								className="object-cover opacity-60"
							/>
							<div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
						</motion.div>
					</div>

					{/* Content Grid */}
					<div className="grid lg:grid-cols-2 gap-8 lg:gap-12 p-6 sm:p-12 lg:p-24 items-center">
						<div className="space-y-8">
							<motion.div
								initial={{ opacity: 0, x: -50 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
							>
								<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
									<Zap size={14} className="fill-current" />
									<span>Next-Gen Shopping</span>
								</div>
								<h2 className="text-4xl sm:text-6xl font-black tracking-tighter leading-tight mb-6">
									Traceability <br />
									<span className="text-emerald-500 italic font-serif">Reinvented</span>
								</h2>
								<p className="text-lg text-gray-300 max-w-xl leading-relaxed">
									Scan any product to reveal its entire journey. From the farm's soil composition 
									to the exact harvest time, transparency is now at your fingertips.
								</p>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8, delay: 0.2 }}
								className="flex flex-wrap gap-4"
							>
								<Button className="h-14 px-8 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-base gap-3">
									<span>Try The App</span>
									<Smartphone size={18} />
								</Button>
								<Button variant="outline" className="h-14 px-8 rounded-2xl border-white/20 hover:bg-white/10 text-white font-bold text-base gap-3 backdrop-blur-sm">
									<span>Learn More</span>
									<ArrowRight size={18} />
								</Button>
							</motion.div>

							{/* Stats */}
							<div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-8 border-t border-white/10">
								{[
									{ label: "Data Points", value: "100+" },
									{ label: "Transparency", value: "100%" },
									{ label: "Blockchains", value: "Verified" },
								].map((stat, i) => (
									<motion.div
										key={i}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										transition={{ duration: 0.5, delay: 0.4 + (i * 0.1) }}
									>
										<div className="text-2xl font-black text-white mb-1">{stat.value}</div>
										<div className="text-xs text-gray-400 uppercase tracking-widest font-bold">{stat.label}</div>
									</motion.div>
								))}
							</div>
						</div>

						{/* Interactive Visual Element */}
						<div className="relative h-64 sm:h-96 lg:h-full min-h-[300px] lg:min-h-[400px] flex items-center justify-center">
							{/* Floating Cards simulating AR overlay */}
							<motion.div
								initial={{ opacity: 0, scale: 0.8 }}
								whileInView={{ opacity: 1, scale: 1 }}
								viewport={{ once: true }}
								transition={{ duration: 0.8 }}
								className="relative scale-75 sm:scale-100" // Scale down for mobile
							>
								<div className="relative w-64 h-64 border-[3px] border-emerald-500/50 rounded-[2rem] flex items-center justify-center">
									<div className="absolute inset-0 rounded-[2rem] bg-emerald-500/10 animate-pulse" />
									<ScanLine size={48} className="text-emerald-400 animate-bounce" />
									
									{/* Floating Data Tags */}
									<motion.div 
										animate={{ x: [0, 10, 0], y: [0, -10, 0] }}
										transition={{ duration: 4, repeat: Infinity }}
										className="absolute -right-20 -top-12 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex gap-3 items-center shadow-2xl"
									>
										<div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
										<div>
											<div className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Origin</div>
											<div className="text-sm font-bold text-white">Vertical Farm #22</div>
										</div>
									</motion.div>

									<motion.div 
										animate={{ x: [0, -10, 0], y: [0, 10, 0] }}
										transition={{ duration: 5, repeat: Infinity, delay: 1 }}
										className="absolute -left-20 -bottom-12 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-xl flex gap-3 items-center shadow-2xl"
									>
										<div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
										<div>
											<div className="text-[10px] uppercase text-gray-400 tracking-wider font-bold">Harvested</div>
											<div className="text-sm font-bold text-white">2 Hours Ago</div>
										</div>
									</motion.div>
								</div>
							</motion.div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
