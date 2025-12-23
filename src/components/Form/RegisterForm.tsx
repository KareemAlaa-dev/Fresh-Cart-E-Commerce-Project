"use client"
import { RegisterFormValues, registerSchema } from '@/schemas/register';
import { zodResolver } from '@hookform/resolvers/zod';

import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { PasswordChecklist } from './PasswordCheckList';
import { Button } from '../ui/button';
import { SignUp } from '@/services/api';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Loader2, User, Mail, Phone, Lock, UserPlus, ArrowRight } from 'lucide-react';

export default function RegisterForm() {
	const [isLoading, setIsLoading] = useState(false);

	const inputs = [
		{ name: "name", formLabel: "Full Name", inputType: "text", placeholder: "John Doe", icon: User },
		{ name: "email", formLabel: "Email Address", inputType: "email", placeholder: "john@example.com", icon: Mail },
		{ name: "phone", formLabel: "Phone Number", inputType: "text", placeholder: "01012345678", icon: Phone },
	];
	const navigate = useRouter()
	const form = useForm<RegisterFormValues>({
		resolver: zodResolver(registerSchema),
		defaultValues: {
			name: "",
			email: "",
			password: "",
			rePassword: "",
			phone: "",
		},
	});

	// Watch password
	const password = form.watch("password");

	const onSubmit = async (values: RegisterFormValues) => {
		setIsLoading(true);
		try {
			const registerRes = await SignUp(values);

			if (registerRes.message === "success") {
				toast.success("Account created successfully!");
				form.reset();
				navigate.push("/auth/login");
			} else {
				toast.error(registerRes.message || "Registration failed. Please try again.");
			}

		} catch (_error) {
			toast.error("Something went wrong. Please try again later.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
				{/* Basic Info Inputs */}
				{inputs.map((item, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: index * 0.1, duration: 0.5 }}
					>
						<FormField
							control={form.control}
							name={item.name as keyof RegisterFormValues}
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center gap-2 mb-1.5">
										<item.icon className="w-4 h-4 text-[#003c1b]" />
										<FormLabel className="text-sm font-bold text-slate-700 m-0">
											{item.formLabel}
										</FormLabel>
									</div>
									<FormControl>
										<Input
											{...field}
											type={item.inputType}
											placeholder={item.placeholder}
											className="h-12 rounded-xl border-slate-200 focus:border-[#003c1b] focus:ring-[#003c1b] transition-all bg-white"
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage className="text-[10px]" />
								</FormItem>
							)}
						/>
					</motion.div>
				))}

				{/* Password Inputs */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.3, duration: 0.5 }}
					>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center gap-2 mb-1.5">
										<Lock className="w-4 h-4 text-[#003c1b]" />
										<FormLabel className="text-sm font-bold text-slate-700 m-0">Password</FormLabel>
									</div>
									<FormControl>
										<Input
											{...field}
											type="password"
											placeholder="••••••••"
											className="h-12 rounded-xl border-slate-200 focus:border-[#003c1b] focus:ring-[#003c1b] transition-all bg-white"
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage className="text-[10px]" />
								</FormItem>
							)}
						/>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.4, duration: 0.5 }}
					>
						<FormField
							control={form.control}
							name="rePassword"
							render={({ field }) => (
								<FormItem>
									<div className="flex items-center gap-2 mb-1.5">
										<Lock className="w-4 h-4 text-[#003c1b]" />
										<FormLabel className="text-sm font-bold text-slate-700 m-0">Confirm</FormLabel>
									</div>
									<FormControl>
										<Input
											{...field}
											type="password"
											placeholder="••••••••"
											className="h-12 rounded-xl border-slate-200 focus:border-[#003c1b] focus:ring-[#003c1b] transition-all bg-white"
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage className="text-[10px]" />
								</FormItem>
							)}
						/>
					</motion.div>
				</div>

				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ delay: 0.5 }}
				>
					<PasswordChecklist password={password} />
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.6, duration: 0.5 }}
				>
					<Button
						type="submit"
						disabled={isLoading}
						className="w-full h-12 mt-4 rounded-xl bg-[#003c1b] hover:bg-[#003c1b]/90 text-white font-bold shadow-lg shadow-[#003c1b]/20 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<Loader2 className="h-4 w-4 animate-spin" />
								Creating Account...
							</>
						) : (
							<>
								Create Account
								<ArrowRight className="h-4 w-4" />
							</>
						)}
					</Button>
				</motion.div>
			</form>
		</Form>
	)
}
