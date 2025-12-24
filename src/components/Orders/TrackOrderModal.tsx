"use client";

import React from 'react';
import { UserOrderResponse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Truck, Package, ShieldCheck, MapPin, Clock, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface TrackOrderModalProps {
	isOpen: boolean;
	onClose: () => void;
	order: UserOrderResponse | null;
}

import { createPortal } from 'react-dom';

export default function TrackOrderModal({ isOpen, onClose, order }: TrackOrderModalProps) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	const steps = [
		{
			id: 'placed',
			label: 'Order Placed',
			description: 'We have received your order.',
			status: 'completed',
			icon: Package,
			date: order?.createdAt
		},
		{
			id: 'confirmed',
			label: 'Processing',
			description: 'We are preparing your items.',
			status: order?.isPaid ? 'completed' : 'current',
			icon: ShieldCheck,
			date: order?.updatedAt
		},
		{
			id: 'shipped',
			label: 'Shipped',
			description: 'Package is on the way.',
			status: order?.isPaid && !order?.isDelivered ? 'current' : (order?.isDelivered ? 'completed' : 'pending'),
			icon: Truck,
			date: null
		},
		{
			id: 'delivered',
			label: 'Delivered',
			description: 'Package delivered successfully.',
			status: order?.isDelivered ? 'completed' : 'pending',
			icon: MapPin,
			date: order?.isDelivered ? order.updatedAt : null
		}
	];

	// Determine active step index for progress bar
	const activeStepIndex = steps.findIndex(step => step.status === 'current');
	const completedSteps = steps.filter(step => step.status === 'completed').length;
	// If no current step is found, but some are completed, the last completed is the active one effectively, or if all completed
	const progressIndex = activeStepIndex !== -1 ? activeStepIndex : (completedSteps === steps.length ? steps.length : completedSteps);

	// Lock body scroll when modal is open and prevent layout shift
	React.useEffect(() => {
		if (isOpen) {
			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			document.body.style.overflow = 'hidden';
			document.body.style.paddingRight = `${scrollbarWidth}px`;
		} else {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		}
		return () => {
			document.body.style.overflow = '';
			document.body.style.paddingRight = '';
		};
	}, [isOpen]);

	if (!mounted) return null;

	return createPortal(
		<AnimatePresence>
			{isOpen && order && (
				<div className="fixed inset-0 z-[10000] z-[10000]">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer"
						aria-hidden="true"
					/>

					{/* Layout Container - Scrollable */}
					<div 
						className="fixed inset-0 overflow-y-auto"
						onClick={(e) => {
							if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('min-h-full')) {
								onClose();
							}
						}}
					>
						<div 
							className="flex min-h-full items-center justify-center p-4 text-center"
							onClick={(e) => {
								if (e.target === e.currentTarget) onClose();
							}}
						>
							
							{/* Tracking Card - Centered */}
							<motion.div
								initial={{ opacity: 0, scale: 0.95, y: 20 }}
								animate={{ opacity: 1, scale: 1, y: 0 }}
								exit={{ opacity: 0, scale: 0.95, y: 20 }}
								className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col my-8"
								onClick={(e) => e.stopPropagation()}
							>
							{/* Header */}
							<div className="relative px-6 sm:px-8 py-5 sm:py-6 bg-slate-900 overflow-hidden shrink-0">
								<div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-no-repeat opacity-50" />
								<div className="relative z-10 flex items-start justify-between gap-4">
									<div className="space-y-1 text-left">
										<h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">Track Order</h2>
										<p className="text-xs font-bold text-slate-400 uppercase tracking-widest break-all">ID: #{order._id.slice(-6).toUpperCase()}</p>
									</div>
									<button 
										onClick={onClose} 
										className="p-2 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-colors backdrop-blur-md shrink-0"
									>
										<X size={20} />
									</button>
								</div>
							</div>

							{/* Timeline Content */}
							<div className="flex-1 overflow-y-auto p-4 sm:p-8 lg:p-10 bg-white">
								<div className="relative space-y-0 text-left">
									{steps.map((step, idx) => {
										const isCompleted = step.status === 'completed';
										const isCurrent = step.status === 'current';
										const isPending = step.status === 'pending';
										const isLast = idx === steps.length - 1;

										return (
											<div key={idx} className={cn("relative z-10 flex gap-4 sm:gap-6 pb-10 sm:pb-12 last:pb-0 group", isLast && "pb-0")}>
												{/* Line connector coloring for completed steps */}
												{!isLast && (
													<div className={cn(
														"absolute left-[19px] sm:left-[27px] top-10 sm:top-12 bottom-0 w-0.5 z-0 transition-colors duration-500 delay-200",
														(isCompleted && steps[idx+1]?.status !== 'pending') ? "bg-emerald-500" : "bg-slate-100"
													)} />
												)}

												{/* Icon Marker */}
												<div className={cn(
													"relative shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm",
													isCompleted 
														? "bg-emerald-500 border-emerald-500 text-white shadow-emerald-200" 
														: isCurrent 
															? "bg-white border-emerald-500 text-emerald-600 shadow-lg shadow-emerald-500/20 scale-110" 
															: "bg-slate-50 border-slate-200 text-slate-300"
												)}>
													<step.icon size={18} className={cn("sm:w-5 sm:h-5 transition-all", isCurrent && "animate-pulse")} />
													
													{/* Current Pulse Effect Ring */}
													{isCurrent && (
														<span className="absolute inset-0 rounded-2xl border-2 border-emerald-500/30 animate-ping" />
													)}
												</div>

												{/* Content */}
												<div className={cn("pt-0.5 sm:pt-1.5 flex-1 transition-opacity duration-300", isPending && "opacity-40 grayscale")}>
													<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-0">
														<h4 className={cn(
															"text-sm sm:text-base font-bold tracking-tight uppercase",
															isCompleted || isCurrent ? "text-slate-900" : "text-slate-500"
														)}>
															{step.label}
														</h4>
														{step.date && <span className="self-start text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-full whitespace-nowrap">{new Date(step.date).toLocaleDateString()}</span>}
													</div>
													
													<p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 leading-normal">
														{step.description}
													</p>
													
													{isCurrent && (
														<div className="mt-2 sm:mt-3 inline-flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-[10px] sm:text-xs font-bold border border-emerald-100">
															<Clock size={12} className="animate-[spin_3s_linear_infinite]" />
															<span>In Progress</span>
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>
							</div>

							{/* Estimated Delivery Footer */}
							<div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0">
								<div className="flex items-center gap-2 sm:gap-3">
									<div className="w-8 h-8 sm:w-10 sm:h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 text-orange-500">
										<Truck size={16} className="sm:w-5 sm:h-5" />
									</div>
									<div className="text-left">
										<p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-widest">Est. Delivery</p>
										<p className="text-xs sm:text-sm font-black text-slate-800">
											{order.isDelivered ? 'Delivered' : 'Within 24 Hours'}
										</p>
									</div>
								</div>
								
								{order.isDelivered && (
									<div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wide">
										<CheckCircle size={14} />
										<span>Complete</span>
									</div>
								)}
							</div>
							</motion.div>
						</div>
					</div>
				</div>
			)}
		</AnimatePresence>,
		document.body
	);
}
