"use client";

import React from 'react';
import { UserOrderResponse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, ShoppingBag, Calendar, CheckCircle, CreditCard, Mail, Phone, MapPin, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface InvoiceModalProps {
	isOpen: boolean;
	onClose: () => void;
	order: UserOrderResponse | null;
}

import { createPortal } from 'react-dom';

export default function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	const handlePrint = () => {
		if (typeof window !== 'undefined') {
			window.print();
		}
	};

	const subtotal = order ? (order.totalOrderPrice - order.taxPrice - order.shippingPrice) : 0;

	// Animation variants for staggered entrance
	const containerVariants = {
		hidden: { opacity: 0 },
		visible: { 
			opacity: 1,
			transition: { 
				staggerChildren: 0.1,
				delayChildren: 0.2
			}
		},
		exit: { opacity: 0 }
	};

	const itemVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: { opacity: 1, y: 0 }
	};

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
				<div 
					id="invoice-print-wrapper"
					className="fixed inset-0 z-[10000] z-[10000]"
				>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-slate-900/60 backdrop-blur-md cursor-pointer print:hidden"
						aria-hidden="true"
					/>

					{/* Layout Container - Scrollable */}
					<div className="fixed inset-0 overflow-y-auto" onClick={(e) => {
						// Close if clicking the background wrapper (but not if bubbling from content)
						if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains('min-h-full')) {
							onClose();
						}
					}}>
						<div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0"
						     onClick={(e) => {
							     if (e.target === e.currentTarget) onClose();
						     }}
						>
							
							{/* Print Styles */}
							<style dangerouslySetInnerHTML={{ __html: `
								@media print {
									@page { margin: 0; size: auto; }
									
									html, body {
										height: auto !important;
										width: 100% !important;
										margin: 0 !important;
										padding: 0 !important;
										overflow: visible !important;
										background: white !important;
										-webkit-print-color-adjust: exact !important;
										print-color-adjust: exact !important;
									}

									/* Hide all non-invoice content */
									body > * { display: none !important; }
									
									/* Make the print wrapper the only visible root */
									#invoice-print-wrapper { 
										display: block !important; 
										position: absolute !important;
										top: 0 !important;
										left: 0 !important;
										width: 100% !important;
										height: auto !important;
										min-height: 100% !important;
										z-index: 9999 !important;
										background: white !important;
										padding: 40px !important;
										overflow: visible !important; /* No scrollbars */
									}

									/* Nuke all internal layout wrappers that cause scrolling/centering */
									#invoice-print-wrapper > div,
									#invoice-print-wrapper > div > div,
									#invoice-print-wrapper > div > div > div {
										position: static !important;
										overflow: visible !important;
										height: auto !important;
										display: block !important;
										padding: 0 !important;
										margin: 0 !important;
										transform: none !important;
									}

									/* Styles for the Card itself */
									#invoice-card {
										position: relative !important;
										width: 100% !important;
										max-width: 800px !important;
										box-shadow: none !important;
										border: 2px solid #e2e8f0 !important;
										border-radius: 12px !important;
										background: white !important;
										margin: 0 auto !important;
										overflow: hidden !important; /* Keeps border radius */
										display: block !important;
									}
									
									/* Fix Image Visibility */
									#invoice-card img {
										display: block !important;
										opacity: 1 !important;
										visibility: visible !important;
										max-width: 100% !important;
									}

									/* Ensure explicit content visibility */
									#invoice-card * {
										visibility: visible !important;
										-webkit-print-color-adjust: exact !important;
										print-color-adjust: exact !important;
									}
									
									/* Restore Table/Grid/Flex layouts inside the card so it looks right */
									#invoice-card .flex { display: flex !important; }
									#invoice-card .grid { display: grid !important; }
									#invoice-card .hidden { display: none !important; }
									
									/* Hide UI-only elements */
									.print-hidden { display: none !important; }

									/* Table Styling */
									#invoice-card table th {
										background-color: #f8fafc !important;
										color: #475569 !important;
									}
									.bg-slate-50\\/30 {
										background-color: #f8fafc !important; 
									}
								}
							`}} />

							{/* Modal Panel */}
							<motion.div
								variants={itemVariants}
								initial="hidden"
								animate="visible"
								exit="hidden"
								className="relative transform overflow-hidden rounded-lg text-left shadow-xl transition-all sm:my-8 w-full max-w-4xl"
								onClick={(e) => e.stopPropagation()}
							>
								{/* Invoice Card Content */}
								<div 
									className="relative w-full bg-white rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col"
									id="invoice-card"
								>
									{/* Header / Actions (Non-Printable) */}
									<div className="flex items-center justify-between px-4 py-4 sm:px-10 sm:py-6 bg-slate-50/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40 print:hidden">
										<div className="flex items-center gap-2 sm:gap-3">
											<div className="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-600/20 shrink-0">
												<ShoppingBag className="text-white h-4 w-4 sm:h-5 sm:w-5" />
											</div>
											<div className="min-w-0">
												<h2 className="text-sm sm:text-base sm:text-lg font-black text-slate-900 tracking-tight truncate">Invoice Details</h2>
												<p className="text-[9px] sm:text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wide truncate">#{order._id.slice(-6).toUpperCase()}</p>
											</div>
										</div>
										
										<div className="flex items-center gap-1.5 sm:gap-3">
											<Button 
												onClick={handlePrint}
												variant="outline"
												size="sm"
												className="hidden sm:flex h-9 text-xs font-black uppercase tracking-wide border-slate-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-all gap-2"
											>
												<Printer size={14} />
												Print Invoice
											</Button>
											<Button
												onClick={handlePrint}
												variant="outline"
												size="icon"
												className="sm:hidden h-8 w-8 sm:h-9 sm:w-9 rounded-full border-slate-200 hover:bg-slate-100"
											>
												<Printer size={14} />
											</Button>
											<button 
												onClick={onClose} 
												className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-500 transition-colors"
											>
												<X size={18} />
											</button>
										</div>
									</div>

									{/* Scrollable Content */}
									<div className="p-4 sm:p-10 lg:p-12 space-y-8 sm:space-y-14 bg-white">
										
										{/* Invoice Header */}
										<div className="flex flex-col sm:flex-row justify-between items-start gap-6 sm:gap-8 border-b border-dashed border-slate-200 pb-8 sm:pb-10">
											<div className="space-y-3 sm:space-y-4 w-full">
												<div className="flex flex-wrap items-center gap-2">
													<span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tighter mr-2">INVOICE</span>
													<span className={cn(
														"px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border",
														order.isPaid 
															? "bg-emerald-50 text-emerald-700 border-emerald-100" 
															: "bg-amber-50 text-amber-700 border-amber-100"
													)}>
														{order.isPaid ? 'Paid' : 'Unpaid'}
													</span>
													<span className={cn(
														"px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest border",
														order.isDelivered 
															? "bg-blue-50 text-blue-700 border-blue-100" 
															: "bg-slate-100 text-slate-600 border-slate-200"
													)}>
														{order.isDelivered ? 'Delivered' : 'Processing'}
													</span>
												</div>
												<div className="space-y-1">
													<div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
														<span className="w-4 shrink-0"><Calendar size={14} /></span>
														<span>{new Date(order.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
													</div>
													<div className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 font-medium">
														<span className="w-4 shrink-0"><CreditCard size={14} /></span>
														<span>{order.paymentMethodType}</span>
													</div>
												</div>
											</div>
											<div className="text-left sm:text-right space-y-1 w-full">
												<p className="text-base sm:text-lg font-bold text-slate-900">Fresh Cart Inc.</p>
												<p className="text-xs sm:text-sm text-slate-500">123 Grocery Lane, Cairo, Egypt</p>
												<p className="text-xs sm:text-sm text-slate-500">support@freshcart.com</p>
												<p className="text-xs sm:text-sm text-slate-500">+20 123 456 7890</p>
											</div>
										</div>

								{/* Customer & Order Info */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-12">
									<div className="space-y-3 sm:space-y-4">
										<h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
											<Mail size={14} /> Bill To
										</h4>
										<div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3 border border-slate-100">
											<p className="font-bold text-slate-900 text-base sm:text-lg break-words">{order.user.name}</p>
											<div className="space-y-1 text-xs sm:text-sm text-slate-600 break-all">
												<p>{order.user.email}</p>
												<p>{order.shippingAddress?.phone}</p>
											</div>
										</div>
									</div>
									<div className="space-y-3 sm:space-y-4">
										<h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
											<MapPin size={14} /> Ship To
										</h4>
										<div className="bg-slate-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 space-y-3 border border-slate-100">
											<p className="font-bold text-slate-900 text-base sm:text-lg">Shipping Address</p>
											<div className="space-y-1 text-xs sm:text-sm text-slate-600">
												<p className="break-words">{order.shippingAddress?.details}</p>
												<p>{order.shippingAddress?.city}, Egypt</p>
											</div>
										</div>
									</div>
								</div>

								{/* Products Section */}
								<div className="space-y-4">
									<h4 className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
										<Package size={14} /> Items Ordered
									</h4>

									{/* Desktop Table View */}
									<div className="hidden md:block overflow-hidden rounded-2xl border border-slate-200">
										<table className="w-full text-sm">
											<thead className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
												<tr>
													<th className="px-6 py-4 text-left">Product Details</th>
													<th className="px-6 py-4 text-center">Qty</th>
													<th className="px-6 py-4 text-right">Unit Price</th>
													<th className="px-6 py-4 text-right">Total</th>
												</tr>
											</thead>
											<tbody className="divide-y divide-slate-100 bg-white">
												{order.cartItems.map((item) => (
													<tr key={item._id} className="hover:bg-slate-50/50 transition-colors">
														<td className="px-6 py-4">
															<div className="flex items-center gap-4">
																<div className="w-12 h-12 bg-white rounded-lg shadow-sm border border-slate-100 p-1 shrink-0">
																	<Image 
																		src={item.product.imageCover || "https://placehold.co/100x100?text=No+Image"}
																		alt={item.product.title}
																		width={48}
																		height={48}
																		className="w-full h-full object-contain"
																		unoptimized
																	/>
																</div>
																<span className="font-bold text-slate-700 line-clamp-2 container">{item.product.title}</span>
															</div>
														</td>
														<td className="px-6 py-4 text-center font-mono text-slate-600 font-medium">x{item.count}</td>
														<td className="px-6 py-4 text-right font-mono text-slate-600">{item.price.toLocaleString()}</td>
														<td className="px-6 py-4 text-right font-bold text-slate-900 font-mono">{(item.price * item.count).toLocaleString()} EGP</td>
													</tr>
												))}
											</tbody>
										</table>
									</div>

									{/* Mobile Card View */}
									<div className="md:hidden space-y-4">
										{order.cartItems.map((item) => (
											<div key={item._id} className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-sm flex gap-3 sm:gap-4 items-start">
												<div className="w-12 h-12 sm:w-16 sm:h-16 bg-slate-50 rounded-lg p-1 shrink-0 border border-slate-100">
													<Image 
														src={item.product.imageCover || "https://placehold.co/100x100?text=No+Image"}
														alt={item.product.title}
														width={64}
														height={64}
														className="w-full h-full object-contain"
														unoptimized
													/>
												</div>
												<div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
													<p className="font-bold text-slate-800 text-xs sm:text-sm line-clamp-2 leading-tight">{item.product.title}</p>
													<div className="flex flex-col xs:flex-row justify-between xs:items-end gap-1">
														<div className="space-y-0.5">
															<p className="text-[10px] sm:text-xs text-slate-500 font-medium">{item.price.toLocaleString()} EGP / unit</p>
															<p className="text-[10px] sm:text-xs font-black text-slate-400 bg-slate-100 inline-block px-1.5 py-0.5 rounded">x{item.count}</p>
														</div>
														<p className="font-black text-emerald-700 text-sm sm:text-base">{(item.price * item.count).toLocaleString()} <span className="text-[10px]">EGP</span></p>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>

								{/* Summary Section */}
								<div className="flex flex-col items-end pt-6 border-t border-slate-100">
									<div className="w-full max-w-xs space-y-3">
										<div className="flex justify-between text-xs sm:text-sm text-slate-500 font-medium">
											<span>Subtotal</span>
											<span className="font-mono text-slate-700">{subtotal.toLocaleString()} EGP</span>
										</div>
										<div className="flex justify-between text-xs sm:text-sm text-slate-500 font-medium">
											<span>Tax (14%)</span>
											<span className="font-mono text-slate-700">{order.taxPrice.toLocaleString()} EGP</span>
										</div>
										<div className="flex justify-between text-xs sm:text-sm text-slate-500 font-medium">
											<span>Shipping</span>
											<span className="font-mono text-slate-700">{order.shippingPrice === 0 ? 'Free' : `${order.shippingPrice} EGP`}</span>
										</div>
										<div className="pt-4 mt-2 border-t-2 border-slate-900 border-dashed flex justify-between items-center">
											<span className="font-black text-base sm:text-lg text-slate-900 uppercase tracking-tight">Total</span>
											<span className="font-black text-xl sm:text-2xl text-emerald-600 tracking-tight">{order.totalOrderPrice.toLocaleString()} <span className="text-xs sm:text-sm text-emerald-600/60">EGP</span></span>
										</div>
									</div>
								</div>

								{/* Footer */}
								<div className="pt-12 text-center space-y-2 print:hidden pb-10">
									<div className="flex items-center justify-center gap-2 text-emerald-600 font-bold text-xs uppercase tracking-widest">
										<CheckCircle size={14} />
										<span>Official Verified Receipt</span>
									</div>
									<p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
										Thank you for shopping with Fresh Cart. If you have any questions about this invoice, please contact our support team.
									</p>
								</div>
							</div>
							
							{/* Decorative Bottom Edge */}
							<div className="h-2 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#f1f5f9_10px,#f1f5f9_20px)] border-t border-slate-100" />
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
