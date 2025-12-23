"use client";

import React from 'react';
import { UserOrderResponse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Package, Truck, CheckCircle, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TrackOrderModalProps {
	isOpen: boolean;
	onClose: () => void;
	order: UserOrderResponse | null;
}

export default function TrackOrderModal({ isOpen, onClose, order }: TrackOrderModalProps) {
	if (!order) return null;

	// inferred steps based on order state
	const steps = [
		{
			id: 'placed',
			label: 'Order Placed',
			date: new Date(order.createdAt).toLocaleDateString(),
			time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			status: 'completed',
			icon: Package
		},
		{
			id: 'confirmed',
			label: 'Order Confirmed',
			date: new Date(order.createdAt).toLocaleDateString(), // Simulating same day confirmation
			time: new Date(new Date(order.createdAt).getTime() + 1000 * 60 * 30).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // +30 mins
			status: order.isPaid ? 'completed' : 'current',
			icon: CheckCircle
		},
		{
			id: 'shipped',
			label: 'Shipped',
			date: order.isPaid ? new Date(new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 24).toLocaleDateString() : '-',
			time: order.isPaid ? '09:00 AM' : '-',
			status: order.isPaid && !order.isDelivered ? 'current' : (order.isDelivered ? 'completed' : 'pending'),
			icon: Truck
		},
		{
			id: 'delivered',
			label: 'Delivered',
			date: order.isDelivered ? new Date(order.updatedAt).toLocaleDateString() : '-',
			time: order.isDelivered ? new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-',
			status: order.isDelivered ? 'completed' : 'pending',
			icon: MapPin
		}
	];

	const currentStepIndex = steps.findLastIndex(s => s.status === 'completed' || s.status === 'current');

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
					/>

					{/* Modal Container */}
					<motion.div
						initial={{ opacity: 0, y: "100%" }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: "100%" }}
						transition={{ type: "spring", damping: 25, stiffness: 300 }}
						className="relative w-full max-w-lg bg-white rounded-t-[2rem] sm:rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
					>
						{/* Header */}
						<div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
							<div>
								<h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
									Track Order
								</h2>
								<p className="text-xs text-slate-500 font-medium mt-1">
									ID: <span className="font-mono text-slate-700">#{order._id.slice(-6).toUpperCase()}</span>
								</p>
							</div>
							<Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-200" onClick={onClose}>
								<X size={20} className="text-slate-500" />
							</Button>
						</div>

						{/* Scrollable Timeline */}
						<div className="flex-1 overflow-y-auto p-6 sm:p-8">
							
							{/* Estimated Delivery Block */}
							<div className="bg-[#003c1b]/5 rounded-2xl p-6 mb-8 flex items-start gap-4 border border-[#003c1b]/10">
								<div className="w-10 h-10 bg-[#003c1b]/10 rounded-xl flex items-center justify-center shrink-0 text-[#003c1b]">
									<Clock size={20} />
								</div>
								<div>
									<h3 className="text-sm font-bold text-[#003c1b] mb-1">Estimated Delivery</h3>
									<p className="text-xs text-[#003c1b]/80 font-medium leading-relaxed">
										{order.isDelivered 
											? "Your package has been delivered." 
											: `Expected by ${new Date(new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 24 * 3).toLocaleDateString()}`}
									</p>
								</div>
							</div>

							{/* Vertical Stepper */}
							<div className="relative pl-4 space-y-12">
								{/* Connecting Line */}
								<div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-slate-100" />
								{/* Active Progress Line */}
								<motion.div 
									initial={{ height: 0 }}
									animate={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
									transition={{ duration: 1, delay: 0.3 }}
									className="absolute left-[27px] top-4 w-0.5 bg-[#003c1b] origin-top max-h-[calc(100%-2rem)]"
								/>

								{steps.map((step, index) => {
									const isCompleted = step.status === 'completed';
									const isCurrent = step.status === 'current';
									const isPending = step.status === 'pending';

									return (
										<motion.div 
											key={step.id}
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											transition={{ delay: index * 0.1 }}
											className="relative flex gap-6"
										>
											{/* Icon Indicator */}
											<div className={cn(
												"relative z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-[3px] transition-all duration-500",
												isCompleted ? "bg-[#003c1b] border-white shadow-lg shadow-[#003c1b]/30" : 
												isCurrent ? "bg-white border-[#003c1b] ring-4 ring-[#003c1b]/10" : 
												"bg-slate-100 border-white text-slate-300"
											)}>
												{isCompleted && <CheckCircle size={12} className="text-white" />}
												{isCurrent && <div className="w-2 h-2 bg-[#003c1b] rounded-full animate-pulse" />}
											</div>

											{/* Content */}
											<div className={cn("flex-1 pt-0.5", isPending && "opacity-40 grayscale")}>
												<h4 className="text-sm font-bold text-slate-900">{step.label}</h4>
												<p className="text-xs text-slate-500 mt-0.5">
													{isPending ? 'Pending' : `${step.date} • ${step.time}`}
												</p>
												{isCurrent && (
													<motion.div 
														initial={{ opacity: 0, height: 0 }}
														animate={{ opacity: 1, height: "auto" }}
														className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-100 text-[10px] text-slate-600"
													>
														We are currently processing this stage. Updates will be sent shortly.
													</motion.div>
												)}
											</div>
										</motion.div>
									);
								})}
							</div>
						</div>

						{/* Footer Actions */}
						<div className="p-4 sm:p-6 border-t border-slate-100 bg-white">
							<Button className="w-full h-12 bg-[#003c1b] text-white rounded-xl font-bold shadow-lg shadow-[#003c1b]/10" onClick={onClose}>
								Close Tracking
							</Button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
