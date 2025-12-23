"use client";

import React, { useRef } from 'react';
import { UserOrderResponse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Printer, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InvoiceModalProps {
	isOpen: boolean;
	onClose: () => void;
	order: UserOrderResponse | null;
}

export default function InvoiceModal({ isOpen, onClose, order }: InvoiceModalProps) {
	const invoiceRef = useRef<HTMLDivElement>(null);

	if (!order) return null;

	const handlePrint = () => {
		// Browser native print
		window.print();
	};

	// Calculate subtotal (approximate since API gives total)
	const subtotal = order.totalOrderPrice - order.taxPrice - order.shippingPrice;

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
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
						initial={{ opacity: 0, scale: 0.95, y: 20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 0 }} // Change y to 0 to prevent jump on exit
						className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col print:shadow-none print:max-h-none print:max-w-none print:w-full print:fixed print:inset-0 print:z-[200] print:rounded-none px-0"
					>
						{/* Header Toolbar - Hidden on Print */}
						<div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 print:hidden">
							<h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
								Invoice Preview
								<span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[10px] uppercase tracking-wider">
									#{order._id.slice(-6).toUpperCase()}
								</span>
							</h2>
							<div className="flex items-center gap-2">
								<Button variant="ghost" size="icon" onClick={() => window.print()} className="hidden sm:flex" title="Print Invoice">
									<Printer size={18} className="text-slate-600" />
								</Button>
								<Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-200" onClick={onClose}>
									<X size={20} className="text-slate-500" />
								</Button>
							</div>
						</div>

						{/* Scrollable Content */}
						<div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100/50 scrollbar-hide print:p-0 print:overflow-visible print:bg-white">
							{/* The Actual Invoice Paper */}
							<div ref={invoiceRef} className="bg-white mx-auto max-w-2xl shadow-sm border border-slate-200 p-6 sm:p-10 min-h-[600px] text-slate-900 print:shadow-none print:border-none print:m-0 print:p-8 print:max-w-none print:w-full print:h-auto">
								
								{/* Invoice Header */}
								<div className="flex flex-col sm:flex-row justify-between items-start mb-8 sm:mb-12 gap-6 sm:gap-0">
									<div>
										<div className="flex items-center gap-2 mb-4">
											<div className="w-8 h-8 bg-[#003c1b] rounded-lg flex items-center justify-center text-white shrink-0">
												<ShoppingBag size={18} />
											</div>
											<span className="text-xl font-black tracking-tight">Fresh<span className="text-[#003c1b] italic font-serif">Cart</span></span>
										</div>
										<div className="text-xs text-slate-500 leading-relaxed">
											<p>FreshCart Inc.</p>
											<p>123 Organic Lane, Green Valley</p>
											<p>Cairo, Egypt</p>
											<p>support@freshcart.com</p>
										</div>
									</div>
									<div className="text-left sm:text-right w-full sm:w-auto">
										<h1 className="text-3xl font-black text-slate-200 uppercase tracking-widest mb-2">Invoice</h1>
										<p className="font-bold text-slate-700">#INV-{order._id.slice(-6).toUpperCase()}</p>
										<p className="text-xs text-slate-500 mt-1">
											Issued: {new Date(order.createdAt).toLocaleDateString()}
										</p>
									</div>
								</div>

								{/* Bill To / Ship To */}
								<div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8 sm:mb-12 border-b border-slate-100 pb-8">
									<div>
										<h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Bill To</h3>
										<p className="font-bold text-sm mb-1">{order.user.name}</p>
										<p className="text-xs text-slate-500 break-all">{order.user.email}</p>
										<p className="text-xs text-slate-500">{order.shippingAddress?.phone}</p>
									</div>
									<div className="text-left sm:text-right">
										<h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Ship To</h3>
										<p className="font-bold text-sm mb-1">{order.shippingAddress?.details}</p>
										<p className="text-xs text-slate-500">{order.shippingAddress?.city}</p>
										<p className="text-xs text-slate-500">Egypt</p>
									</div>
								</div>

								{/* Line Items */}
								<div className="mb-10">
									{/* Mobile Item List (visible < 640px) */}
									<div className="block sm:hidden space-y-4">
										{order.cartItems.map((item) => (
											<div key={item._id} className="flex justify-between items-start border-b border-slate-50 pb-4 last:border-0">
												<div className="pr-4">
													<p className="text-sm font-bold text-slate-800">{item.product.title}</p>
													<p className="text-[10px] text-slate-400 mb-1">{item.product.brand.name}</p>
													<p className="text-xs text-slate-500">Qty: {item.count} × {item.price.toLocaleString()}</p>
												</div>
												<div className="text-right whitespace-nowrap">
													<p className="text-sm font-bold text-slate-900">{(item.price * item.count).toLocaleString()}</p>
												</div>
											</div>
										))}
									</div>

									{/* Desktop Table (visible >= 640px) */}
									<table className="hidden sm:table w-full text-left">
										<thead>
											<tr className="border-b-2 border-slate-100">
												<th className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 w-1/2">Item Description</th>
												<th className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Qty</th>
												<th className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Price</th>
												<th className="py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Amount</th>
											</tr>
										</thead>
										<tbody className="divide-y divide-slate-50">
											{order.cartItems.map((item) => (
												<tr key={item._id}>
													<td className="py-4">
														<p className="text-sm font-bold text-slate-800">{item.product.title}</p>
														<p className="text-[10px] text-slate-400">{item.product.brand.name}</p>
													</td>
													<td className="py-4 text-center text-sm font-medium">{item.count}</td>
													<td className="py-4 text-right text-sm text-slate-600">{item.price.toLocaleString()}</td>
													<td className="py-4 text-right text-sm font-bold text-slate-900">{(item.price * item.count).toLocaleString()}</td>
												</tr>
											))}
										</tbody>
									</table>
								</div>

								{/* Summary Totals */}
								<div className="flex justify-end mb-12">
									<div className="w-full sm:w-1/3 space-y-3">
										<div className="flex justify-between text-xs text-slate-500">
											<span>Subtotal</span>
											<span className="font-medium">{subtotal > 0 ? subtotal.toLocaleString() : order.totalOrderPrice.toLocaleString()} EGP</span>
										</div>
										<div className="flex justify-between text-xs text-slate-500">
											<span>Tax (14%)</span>
											<span className="font-medium">{order.taxPrice.toLocaleString()} EGP</span>
										</div>
										<div className="flex justify-between text-xs text-slate-500">
											<span>Shipping</span>
											<span className="font-medium">{order.shippingPrice === 0 ? 'Free' : `${order.shippingPrice} EGP`}</span>
										</div>
										<div className="h-px bg-slate-200 my-2" />
										<div className="flex justify-between text-base font-black text-slate-900">
											<span>Total</span>
											<span>{order.totalOrderPrice.toLocaleString()} EGP</span>
										</div>
									</div>
								</div>

								{/* Footer */}
								<div className="text-center pt-8 border-t border-slate-100">
									<p className="text-xs font-bold text-slate-900 mb-1">Thank you for your business!</p>
									<p className="text-[10px] text-slate-400">If you have questions about this invoice, please contact support.</p>
								</div>

							</div>
						</div>

						{/* Mobile Footer Actions */}
						<div className="p-4 border-t border-slate-100 bg-white sm:hidden flex gap-3">
							<Button className="flex-1 bg-[#003c1b] text-white" onClick={() => window.print()}>
								Print / PDF
							</Button>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
