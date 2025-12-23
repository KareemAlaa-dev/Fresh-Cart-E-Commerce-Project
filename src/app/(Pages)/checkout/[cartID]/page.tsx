"use client"
import CheckoutForm from '@/components/Form/CheckoutForm'
import { useParams } from 'next/navigation'
import React from 'react'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, Sparkles } from 'lucide-react'

export default function CheckOut() {
	const { cartID } = useParams<{ cartID: string }>()

	return (
		<div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden">
			{/* Animated Background Elements */}
			<div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
				<motion.div 
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
					className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"
				/>
				<motion.div 
					initial={{ opacity: 0, scale: 0.8 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 3, delay: 1, repeat: Infinity, repeatType: "reverse" }}
					className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"
				/>
			</div>

			<motion.div 
				initial={{ opacity: 0, y: 30 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="w-full max-w-lg"
			>
				{/* Header Section */}
				<div className="text-center mb-8 sm:mb-10">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-slate-200/50 text-slate-500 text-[10px] sm:text-xs font-black uppercase tracking-widest mb-6 shadow-sm"
					>
						<Lock size={12} className="text-primary" />
						<span>Secure Checkout</span>
					</motion.div>

					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3">
						Finalize Your <span className="text-primary italic font-serif">Order</span>
					</h1>
					<p className="text-slate-500 text-sm sm:text-base max-w-xs mx-auto">
						Please provide your delivery details to complete the purchase securely.
					</p>
				</div>

				{/* Card Container */}
				<div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-primary/5 border border-white p-6 sm:p-10 relative overflow-hidden">
					<div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
					
					<CheckoutForm cartID={cartID} />

					{/* Trust Badges */}
					<div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-400 font-medium">
						<div className="flex items-center gap-2">
							<ShieldCheck size={14} className="text-emerald-500" />
							<span>Encrypted Payment</span>
						</div>
						<span className="hidden sm:block w-1 h-1 rounded-full bg-slate-200" />
						<div className="flex items-center gap-2">
							<Sparkles size={14} className="text-amber-500" />
							<span>Premium Delivery</span>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	)
}
