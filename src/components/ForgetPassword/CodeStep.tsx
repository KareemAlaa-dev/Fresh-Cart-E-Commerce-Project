"use client";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { codeSchema, CodeFormValues } from "@/schemas/forgetPassword";
import { motion } from "framer-motion";
import { KeyRound, Loader2, ArrowRight, ArrowLeft } from "lucide-react";

interface CodeStepProps {
	onSubmit: (values: CodeFormValues) => void;
	onBack: () => void;
	loading: boolean;
}

export default function CodeStep({ onSubmit, onBack, loading }: CodeStepProps) {
	const form = useForm<CodeFormValues>({
		resolver: zodResolver(codeSchema),
		defaultValues: { resetCode: "" },
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
						name="resetCode"
						render={({ field }) => (
							<FormItem>
								<div className="flex items-center gap-2 mb-2">
									<KeyRound className="w-4 h-4 text-[#003c1b]" />
									<FormLabel className="text-sm font-bold text-slate-700 m-0">Verification Code</FormLabel>
								</div>
								<FormControl>
									<Input
										{...field}
										type="text"
										placeholder="Enter 6-digit code"
										className="h-12 rounded-xl border-slate-200 focus:border-[#003c1b] focus:ring-[#003c1b] transition-all text-center tracking-[0.5em] font-bold text-xl"
										disabled={loading}
										maxLength={6}
									/>
								</FormControl>
								<FormMessage className="text-xs" />
							</FormItem>
						)}
					/>

					<div className="flex flex-col gap-3">
						<Button 
							type="submit" 
							disabled={loading}
							className="w-full h-12 rounded-xl bg-[#003c1b] hover:bg-[#003c1b]/90 text-white font-bold shadow-lg shadow-[#003c1b]/20 transition-all gap-2"
						>
							{loading ? (
								<>
									<Loader2 className="w-4 h-4 animate-spin" />
									Verifying...
								</>
							) : (
								<>
									Verify Code
									<ArrowRight className="w-4 h-4" />
								</>
							)}
						</Button>
						
						<Button 
							type="button"
							variant="ghost"
							onClick={onBack}
							disabled={loading}
							className="w-full h-11 rounded-xl text-slate-500 font-bold hover:bg-slate-50 transition-all gap-2"
						>
							<ArrowLeft className="w-4 h-4" />
							Change Email
						</Button>
					</div>
				</form>
			</Form>
		</motion.div>
	);
}
