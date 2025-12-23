"use client"
import { forgetPassword, resetPassword, verifyCode } from "@/services/api";
import React from "react";
import EmailStep from "@/components/ForgetPassword/EmailStep";
import CodeStep from "@/components/ForgetPassword/CodeStep";
import PasswordStep from "@/components/ForgetPassword/PasswordStep";
import toast from "react-hot-toast";
import { useStepper } from "@/Hooks/useStepper";
import { CodeFormValues, EmailFormValues, PasswordFormInput } from "@/schemas/forgetPassword";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Sparkles, Package, Leaf, ArrowLeft, KeyRound, Mail, Lock } from "lucide-react";
import Link from "next/link";

const steps = [
	{ title: "Email", icon: Mail },
	{ title: "Verify", icon: KeyRound },
	{ title: "Reset", icon: Lock }
];

export default function ForgotPassword() {
	const { step: activeStep, next, back } = useStepper(0);
	const [loading, setLoading] = React.useState(false);
	const [email, setEmail] = React.useState("");

	const router = useRouter()

	async function handleEmail(values: EmailFormValues) {
		setLoading(true);
		try {
			const res = await forgetPassword(values);
			if (res.statusMsg === "success") {
				setEmail(values.email);
				toast.success("Code sent successfully");
				next();
			} else toast.error(res.message);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	async function handleCode(values: CodeFormValues) {
		setLoading(true);
		try {
			const res = await verifyCode(values);
			if (res.status?.toLowerCase() === "success") {
				toast.success("Code verified successfully");
				next();
			} else toast.error(res.status);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Invalid code");
		} finally {
			setLoading(false);
		}
	}

	async function handlePassword(values: PasswordFormInput) {
		setLoading(true);
		try {
			const res = await resetPassword({ ...values, email });
			if (res.token) {
				toast.success("Password reset successfully");
				router.push("/auth/login");
			} else {
				toast.error("Failed to reset password. Please try again.");
			}
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	function renderStepContent() {
		switch (activeStep) {
			case 0: return <EmailStep loading={loading} onSubmit={handleEmail} />;
			case 1: return <CodeStep loading={loading} onSubmit={handleCode} onBack={back} />;
			case 2: return <PasswordStep loading={loading} onSubmit={handlePassword} onBack={back} />;
			default: return null;
		}
	}

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
							Security Check
						</h1>
						<p className="text-slate-500 font-medium text-sm sm:text-base">
							Let's get you back into your account safely
						</p>
					</motion.div>

					{/* Smart Progress Tracker */}
					<div className="mb-12 relative">
						<div className="flex justify-between items-center relative z-10 px-1">
							{/* Progress Line Container - Centers the line between icons */}
							<div className="absolute top-5 left-5 right-5 h-[2px] -z-10">
								{/* Background Progress Line */}
								<div className="w-full h-full bg-slate-100" />
								
								{/* Active Progress Line */}
								<motion.div 
									className="absolute top-0 left-0 h-full bg-[#003c1b] shadow-[0_0_10px_rgba(0,60,27,0.3)]"
									initial={{ width: "0%" }}
									animate={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
									transition={{ duration: 0.8, ease: "circOut" }}
								/>
							</div>

							{steps.map((step, idx) => {
								const isCompleted = idx < activeStep;
								const isActive = idx === activeStep;
								const StepIcon = step.icon;

								return (
									<div key={idx} className="flex flex-col items-center gap-3">
										<div className="relative">
											{/* Glowing Effect for Active Step */}
											{isActive && (
												<motion.div
													layoutId="active-glow"
													className="absolute inset-0 bg-[#003c1b]/20 rounded-full blur-md"
													animate={{ scale: [1, 1.4, 1] }}
													transition={{ duration: 2, repeat: Infinity }}
												/>
											)}
											
											<motion.div
												initial={false}
												animate={{
													backgroundColor: isCompleted || isActive ? "#003c1b" : "#fff",
													borderColor: isCompleted || isActive ? "#003c1b" : "#e2e8f0",
													scale: isActive ? 1.1 : 1,
												}}
												className="w-10 h-10 rounded-full border-2 flex items-center justify-center relative z-10 transition-shadow duration-300 shadow-sm"
											>
												<AnimatePresence mode="wait">
													{isCompleted ? (
														<motion.div
															key="check"
															initial={{ scale: 0, rotate: -45 }}
															animate={{ scale: 1, rotate: 0 }}
															exit={{ scale: 0 }}
														>
															<Sparkles className="w-5 h-5 text-white" />
														</motion.div>
													) : (
														<motion.div
															key="icon"
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															className={isActive ? "text-white" : "text-slate-400"}
														>
															<StepIcon className="w-5 h-5" />
														</motion.div>
													)}
												</AnimatePresence>
											</motion.div>
										</div>

										<motion.span 
											animate={{
												color: isActive ? "#003c1b" : "#94a3b8",
												fontWeight: isActive ? 900 : 700
											}}
											className="text-[10px] uppercase tracking-[0.15em]"
										>
											{step.title}
										</motion.span>
									</div>
								);
							})}
						</div>
					</div>

					{/* Form Content */}
					<div className="min-h-[200px]">
						<AnimatePresence mode="wait">
							{renderStepContent()}
						</AnimatePresence>
					</div>

					{/* Footer link */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.5 }}
						className="mt-8 text-center"
					>
						<Link href="/auth/login" className="text-sm font-bold text-slate-400 hover:text-[#003c1b] transition-all flex items-center justify-center gap-2">
							<ArrowLeft className="w-4 h-4" />
							Back to Sign In
						</Link>
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
						animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }}
						transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
						className="absolute -top-20 -right-20 w-96 h-96 bg-white/5 rounded-full blur-3xl"
					/>
					<motion.div
						animate={{ rotate: [360, 0], scale: [1, 1.2, 1] }}
						transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
						className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"
					/>
				</div>

				<div className="relative z-10 text-white max-w-lg">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4, duration: 0.6 }}
					>
						<h2 className="text-4xl xl:text-5xl font-black mb-6 leading-tight">
							Keep Your Account <span className="text-[#86efac] italic font-serif">Safe</span>
						</h2>
						<p className="text-lg text-white/80 mb-8 leading-relaxed font-medium">
							Enhanced encryption and secure verification processes ensure your data remains protected at all times.
						</p>
					</motion.div>

					{/* Features list */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.6, duration: 0.6 }}
						className="space-y-4"
					>
						{[
							{ icon: Sparkles, text: "Multi-factor Security" },
							{ icon: Package, text: "Instant Reset Links" },
							{ icon: Leaf, text: "Privacy-first Approach" }
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
								<span className="font-bold text-white/90">{feature.text}</span>
							</motion.div>
						))}
					</motion.div>
				</div>
			</motion.div>
		</div>
	);
}
