"use client";

import React from 'react';
import { UserOrderResponse } from '@/types';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Package, Calendar, CreditCard, CheckCircle, XCircle, Clock, Truck, ChevronRight, FileText, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface OrdersListProps {
	orders: UserOrderResponse[];
}

const container = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1
		}
	}
};

const item = {
	hidden: { opacity: 0, y: 20 },
	show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } } as any
};

import InvoiceModal from './InvoiceModal';
import TrackOrderModal from './TrackOrderModal';

export default function OrdersList({ orders }: OrdersListProps) {
	const [selectedOrder, setSelectedOrder] = React.useState<UserOrderResponse | null>(null);
	const [isInvoiceOpen, setIsInvoiceOpen] = React.useState(false);
	const [isTrackOrderOpen, setIsTrackOrderOpen] = React.useState(false);

	const handleOpenInvoice = (order: UserOrderResponse) => {
		setSelectedOrder(order);
		setIsInvoiceOpen(true);
	};

	const handleOpenTrack = (order: UserOrderResponse) => {
		setSelectedOrder(order);
		setIsTrackOrderOpen(true);
	};

	return (
		<>
			<motion.div 
				variants={container}
				initial="hidden"
				animate="show"
				className="space-y-4 sm:space-y-6"
			>
				{orders.map((order) => {
					// Determining Status Logic
					const isProcessing = order.isPaid && !order.isDelivered;
					const isDelivered = order.isDelivered;

					let statusColor = "bg-orange-50 text-orange-600 border-orange-100";
					let statusIcon = <Clock size={12} />;
					let statusText = "Pending";
					let progressWidth = "w-[10%]";
					let progressColor = "bg-[#003c1b]";

					if (isProcessing) {
						statusColor = "bg-blue-50 text-blue-600 border-blue-100";
						statusIcon = <Truck size={12} />;
						statusText = "Processing";
						progressWidth = "w-[50%]";
						progressColor = "bg-[#003c1b]";
					} else if (isDelivered) {
					statusColor = "bg-[#003c1b]/5 text-[#003c1b] border-[#003c1b]/10";
					statusIcon = <CheckCircle size={12} />;
					statusText = "Delivered";
					progressWidth = "w-full";
					progressColor = "bg-[#003c1b]";
				}

				return (
					<motion.div 
						variants={item} 
						key={order._id}
						className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-100 p-4 sm:p-8 shadow-sm hover:shadow-lg hover:shadow-[#003c1b]/5 transition-all duration-300 relative overflow-hidden"
					>
						{/* Progress Bar Background (Subtle) */}
						<div className="absolute top-0 left-0 right-0 h-1 bg-slate-50">
							<div className={cn("h-full transition-all duration-1000 ease-out", progressWidth, progressColor)} />
						</div>

						{/* Order Header */}
						<div className="flex flex-col gap-4 mb-6">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
								<div className="space-y-1">
									<div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
										<h3 className="text-base sm:text-xl font-black text-slate-900 tracking-tight">
											Order <span className="text-slate-400">#</span>{order._id.slice(-6).toUpperCase()}
										</h3>
										<div className={cn("flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] sm:text-[10px] font-black uppercase tracking-wider", statusColor)}>
											{statusIcon}
											<span>{statusText}</span>
										</div>
									</div>
									<div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-slate-500">
										<span className="flex items-center gap-1.5">
											<Calendar size={13} />
											{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
										</span>
										<span className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
										<span className="flex items-center gap-1.5">
											<CreditCard size={13} />
											{order.paymentMethodType === 'card' ? 'Card' : 'Cash'}
										</span>
									</div>
								</div>
								
								{/* Total & Action */}
								<div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-50 w-full sm:w-auto">
									<div className="text-left sm:text-right">
										<p className="text-[9px] font-bold uppercase text-slate-400 tracking-wider mb-0.5">Total</p>
										<p className="text-lg sm:text-2xl font-black text-slate-900 leading-none">
											{order.totalOrderPrice.toLocaleString()} <span className="text-xs sm:text-sm text-slate-400 font-bold">EGP</span>
										</p>
									</div>
									<Button 
										size="sm" 
										variant="outline" 
										className="h-9 w-9 p-0 rounded-full sm:hidden border-slate-200 text-slate-400"
										onClick={() => handleOpenInvoice(order)}
									>
										<FileText size={16} />
									</Button>
								</div>
							</div>
						</div>

						{/* Order Visuals & Actions */}
						<div className="flex flex-col sm:flex-row gap-6">
							<div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x flex-1">
								{order.cartItems.map((item) => (
									<div key={item._id} className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 overflow-hidden snap-start">
										<Image
											src={item.product.imageCover || "https://placehold.co/400x400?text=No+Image"}
											alt={item.product.title}
											fill
											className="object-cover p-1.5 sm:p-2"
											sizes="100px"
										/>
										<div className="absolute bottom-0 right-0 bg-[#003c1b] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-tl-md">
											x{item.count}
										</div>
									</div>
								))}
							</div>

							{/* Actions */}
							<div className="flex items-center gap-2 sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
								<Button 
									variant="ghost" 
									size="sm" 
									className="hidden sm:flex text-xs font-bold text-slate-500 hover:text-[#003c1b] gap-2"
									onClick={() => handleOpenInvoice(order)}
								>
									<FileText size={14} />
									Invoice
								</Button>
								<Button 
									size="sm" 
									className="w-full sm:w-auto rounded-xl bg-[#003c1b] hover:bg-[#003c1b]/90 text-white font-bold text-xs gap-2 shadow-lg shadow-[#003c1b]/20"
									onClick={() => handleOpenTrack(order)}
								>
									<MapPin size={14} />
									<span>Track Order</span>
								</Button>
							</div>
						</div>
					</motion.div>
					);
				})}
			</motion.div>

			<InvoiceModal 
				isOpen={isInvoiceOpen} 
				onClose={() => setIsInvoiceOpen(false)} 
				order={selectedOrder} 
			/>
			
			<TrackOrderModal
				isOpen={isTrackOrderOpen}
				onClose={() => setIsTrackOrderOpen(false)}
				order={selectedOrder}
			/>
		</>
	);
}
