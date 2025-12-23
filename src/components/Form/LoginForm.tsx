"use client";
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginFormValues, loginSchema } from "@/schemas/login";
import toast from "react-hot-toast";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight, Eye, EyeOff, Github, Chrome } from "lucide-react";
import Link from "next/link";


export default function LoginForm() {
	const router = useRouter();
	const searchParams = useSearchParams()
	const callbackUrl = searchParams.get("callbackUrl") || "/products"
	
	const [isLoading, setIsLoading] = useState(false)
	const [showPassword, setShowPassword] = useState(false)
	const [rememberMe, setRememberMe] = useState(false)

	const form = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: LoginFormValues) => {
		setIsLoading(true)
		try {
			const response = await signIn("credentials", {
				email: values.email,
				password: values.password,
				redirect: false
			});
			if (response?.ok) {
				toast.success("Successfully logged in!")
				router.push(callbackUrl)
			} else {
				toast.error("Invalid email or password. Please try again.");
			}
		} catch (error) {
			console.error("Logging in error:", error);
			toast.error("Authentication service unavailable. Try again later.");
		}
		setIsLoading(false)
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{/* Email Field */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1 }}
				>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center gap-2 mb-1.5">
									<Mail className="w-4 h-4 text-[#003c1b]" />
									<FormLabel className="text-sm font-bold text-slate-700 m-0">Email Address</FormLabel>
								</div>
								<FormControl>
									<Input
										{...field}
										type="email"
										placeholder="john@example.com"
										className="h-12 rounded-xl border-slate-200 focus:border-[#003c1b] focus:ring-[#003c1b] transition-all bg-white"
										disabled={isLoading}
									/>
								</FormControl>
								<FormMessage className="text-[10px]" />
							</FormItem>
						)}
					/>
				</motion.div>

				{/* Password Field */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
				>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center justify-between mb-1.5 px-1">
									<div className="flex items-center gap-2">
										<Lock className="w-4 h-4 text-[#003c1b]" />
										<FormLabel className="text-sm font-bold text-slate-700 m-0">Password</FormLabel>
									</div>
									<Link 
										href="/forgotpassword" 
										className="text-[11px] font-bold text-[#003c1b] hover:text-[#005a2b] transition-colors"
									>
										Forgot?
									</Link>
								</div>
								<FormControl>
									<div className="relative group">
										<Input
											{...field}
											type={showPassword ? "text" : "password"}
											placeholder="••••••••"
											className="h-12 rounded-xl border-slate-200 focus:border-[#003c1b] focus:ring-[#003c1b] transition-all bg-white pr-12"
											disabled={isLoading}
										/>
										<button
											type="button"
											onClick={() => setShowPassword(!showPassword)}
											className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#003c1b] transition-colors p-1 rounded-lg"
										>
											{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
										</button>
									</div>
								</FormControl>
								<FormMessage className="text-[10px]" />
							</FormItem>
						)}
					/>
				</motion.div>

				{/* Remember Me Toggle */}
				<motion.div 
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3 }}
					className="flex items-center gap-2 px-1"
				>
					<button
						type="button"
						onClick={() => setRememberMe(!rememberMe)}
						className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
							rememberMe ? "bg-[#003c1b] border-[#003c1b]" : "border-slate-300 bg-white"
						}`}
					>
						{rememberMe && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
					</button>
					<span className="text-xs font-bold text-slate-500 cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
						Trust this device
					</span>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4 }}
				>
					<Button
						type="submit"
						disabled={isLoading}
						className="w-full h-12 mt-2 rounded-xl bg-[#003c1b] hover:bg-[#003c1b]/90 text-white font-bold shadow-lg shadow-[#003c1b]/20 transition-all gap-2"
					>
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Verifying...
							</>
						) : (
							<>
								Enter Workspace
								<ArrowRight className="h-4 w-4" />
							</>
						)}
					</Button>
				</motion.div>

			</form>
		</Form>
	)
}
