"use client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, EmailFormValues } from "@/schemas/forgetPassword";
import { motion } from "framer-motion";
import { Mail, Loader2, ArrowRight } from "lucide-react";

interface EmailStepProps {
	onSubmit: (values: EmailFormValues) => void;
	loading: boolean;
}

export default function EmailStep({ onSubmit, loading }: EmailStepProps) {
	const form = useForm<EmailFormValues>({
		resolver: zodResolver(emailSchema),
		defaultValues: { email: "" },
	});

	return (
		<motion.div
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			transition={{ duration: 0.5 }}
		>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center gap-2 mb-2">
									<Mail className="w-4 h-4 text-[#003c1b]" />
									<FormLabel className="text-sm font-bold text-slate-700 m-0">Email Address</FormLabel>
								</div>
								<FormControl>
									<Input
										{...field}
										type="email"
										placeholder="john@example.com"
										className="h-12 rounded-xl border-slate-200 focus:border-[#003c1b] focus:ring-[#003c1b] transition-all"
										disabled={loading}
									/>
								</FormControl>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>

					<Button 
						type="submit" 
						disabled={loading}
						className="w-full h-12 rounded-xl bg-[#003c1b] hover:bg-[#003c1b]/90 text-white font-bold shadow-lg shadow-[#003c1b]/20 transition-all gap-2"
					>
						{loading ? (
							<>
								<Loader2 className="w-4 h-4 animate-spin" />
								Sending Code...
							</>
						) : (
							<>
								Send Reset Code
								<ArrowRight className="w-4 h-4" />
							</>
						)}
					</Button>
				</form>
			</Form>
		</motion.div>
	);
}
