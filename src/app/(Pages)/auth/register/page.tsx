"use client"
import RegisterForm from "@/components/Form/RegisterForm";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Sparkles, Package, Leaf } from "lucide-react";

export default function RegisterPage() {
	return (
		<div className="min-h-screen flex flex-col lg:flex-row">
			{/* Left Side - Form */}
			<div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 from-slate-50 to-slate-100">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className="w-full max-w-md bg-white/80 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-xl border border-white/20"
				>
					{/* Logo/Brand */}
					<Link href="/" className="flex items-center gap-2 mb-8 group w-fit">
						<div className="w-10 h-10 bg-[#003c1b] rounded-xl flex items-center justify-center shadow-lg shadow-[#003c1b]/20 group-hover:scale-105 transition-transform">
							<ShoppingBag className="text-white h-5 w-5" />
						</div>
						<div className="flex flex-col">
							<span className="text-xl font-black text-slate-900 tracking-tight leading-none">
								Fresh<span className="text-[#003c1b] italic font-serif">Cart</span>
							</span>
							<span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
								Premium Grocer
							</span>
						</div>
					</Link>

					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2, duration: 0.5 }}
						className="mb-8"
					>
						<h1 className="text-3xl sm:text-4xl font-black mb-2 text-slate-900 tracking-tight">
							Create Account
						</h1>
						<p className="text-slate-500 font-medium text-sm sm:text-base">
							Join us and start your organic journey today
						</p>
					</motion.div>

					{/* Form */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<RegisterForm />
					</motion.div>

					{/* Footer Link */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5, duration: 0.5 }}
						className="mt-6 text-center"
					>
						<p className="text-sm text-slate-500">
							Already have an account?{" "}
							<Link
								href="/auth/login"
								className="text-[#003c1b] font-bold hover:underline transition-all"
							>
								Sign in
							</Link>
						</p>
					</motion.div>
				</motion.div>
			</div>

			{/* Right Side - Branding (Hidden on mobile) */}
			<motion.div
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.8 }}
				className="hidden lg:flex flex-1 bg-gradient-to-br from-[#003c1b] to-[#005a2b] relative overflow-hidden items-center justify-center p-12"
			>
				{/* Decorative Elements */}
				<div className="absolute inset-0 overflow-hidden">
					<motion.div
						animate={{
							rotate: [0, 360],
							scale: [1, 1.1, 1]
						}}
						transition={{
							duration: 20,
							repeat: Infinity,
							ease: "linear"
						}}
						className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"
					/>
					<motion.div
						animate={{
							rotate: [360, 0],
							scale: [1, 1.2, 1]
						}}
						transition={{
							duration: 25,
							repeat: Infinity,
							ease: "linear"
						}}
						className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
					/>
				</div>

				{/* Content */}
				<div className="relative z-10 text-white max-w-lg">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.6 }}
					>
						<h2 className="text-4xl xl:text-5xl font-black mb-6 leading-tight">
							Welcome to Fresh Living
						</h2>
						<p className="text-lg text-white/80 mb-8 leading-relaxed">
							Discover premium organic products delivered fresh to your doorstep. Join thousands of happy customers.
						</p>
					</motion.div>

					{/* Features */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.6 }}
						className="space-y-4"
					>
						{[
							{ icon: Sparkles, text: "Premium Quality Products" },
							{ icon: Package, text: "Fast & Reliable Delivery" },
							{ icon: Leaf, text: "100% Organic & Fresh" }
						].map((feature, index) => (
							<motion.div
								key={index}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
								className="flex items-center gap-3"
							>
								<div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
									<feature.icon className="w-5 h-5 text-white" />
								</div>
								<span className="font-medium text-white/90">{feature.text}</span>
							</motion.div>
						))}
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
