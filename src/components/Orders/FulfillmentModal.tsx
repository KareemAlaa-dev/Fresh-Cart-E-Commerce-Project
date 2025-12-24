"use client";

import React, { useState, useRef, useEffect } from 'react';
import { UserOrderResponse } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { 
	X, Printer, ShoppingBag, Truck, MapPin, Package, 
	CheckCircle, Clock, FileText, 
	Info, Calendar, CreditCard, ChevronRight,
	ArrowUpRight, ExternalLink, ShieldCheck, QrCode
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface FulfillmentModalProps {
	isOpen: boolean;
	onClose: () => void;
	order: UserOrderResponse | null;
	initialTab?: 'tracking' | 'invoice';
}

export default function FulfillmentModal({ isOpen, onClose, order, initialTab = 'tracking' }: FulfillmentModalProps) {
	const [activeTab, setActiveTab] = useState<'tracking' | 'invoice'>(initialTab);
	const hasTriggeredPrint = useRef(false);

	// Sync active tab with initialTab when opening
	useEffect(() => {
		if (isOpen) {
			setActiveTab(initialTab);
		}
	}, [isOpen, initialTab]);

	// Body scroll lock
	useEffect(() => {
		if (!isOpen) {
			hasTriggeredPrint.current = false;
			document.body.style.overflow = 'unset';
		} else {
			document.body.style.overflow = 'hidden';
		}

		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	if (!isOpen || !order) return null;

	const handlePrint = () => {
		if (typeof window !== 'undefined') {
			window.print();
		}
	};

	// Tracking Steps Logic
	const steps = [
		{
			id: 'placed',
			label: 'Protocol Initiated',
			description: 'Digital record established in logistics cloud.',
			date: new Date(order.createdAt).toLocaleDateString(),
			time: new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			status: 'completed',
			icon: Package
		},
		{
			id: 'confirmed',
			label: 'Freshness Audit',
			description: 'Organic certification verified at hub.',
			date: new Date(order.createdAt).toLocaleDateString(), 
			time: new Date(new Date(order.createdAt).getTime() + 1000 * 60 * 30).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			status: order.isPaid ? 'completed' : 'current',
			icon: ShieldCheck
		},
		{
			id: 'shipped',
			label: 'Route Execution',
			description: 'Courier assigned & package in transit.',
			date: order.isPaid ? new Date(new Date(order.createdAt).getTime() + 1000 * 60 * 60 * 24).toLocaleDateString() : 'TBD',
			time: order.isPaid ? '09:00 AM' : '...',
			status: order.isPaid && !order.isDelivered ? 'current' : (order.isDelivered ? 'completed' : 'pending'),
			icon: Truck
		},
		{
			id: 'delivered',
			label: 'Order Finalized',
			description: 'Handed over at secure destination.',
			date: order.isDelivered ? new Date(order.updatedAt).toLocaleDateString() : 'TBD',
			time: order.isDelivered ? new Date(order.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...',
			status: order.isDelivered ? 'completed' : 'pending',
			icon: MapPin
		}
	];

	const currentStepIndex = steps.findLastIndex(s => s.status === 'completed' || s.status === 'current');
	const subtotal = order.totalOrderPrice - order.taxPrice - order.shippingPrice;

	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-[10000] flex items-center justify-center overflow-hidden p-0 sm:p-2 md:p-10 safe-top">
					{/* Cinematic Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-[#001005]/98 backdrop-blur-3xl cursor-pointer print:hidden"
					/>

					{/* Ink-Friendly Print Overrides */}
					<style dangerouslySetInnerHTML={{ __html: `
						@media print {
							@page { margin: 0; size: auto; }
							body * { visibility: hidden !important; }
							#invoice-print-root, #invoice-print-root * { visibility: visible !important; }
							#invoice-print-root {
								position: absolute !important;
								left: 0 !important;
								top: 0 !important;
								width: 100% !important;
								background: white !important;
								color: black !important;
								padding: 0 !important;
							}
							.invoice-summary-dark { background: #f8fafc !important; color: black !important; border: 1px solid #e2e8f0 !important; border-radius: 0 !important; box-shadow: none !important; }
							.invoice-summary-dark * { color: black !important; opacity: 1 !important; }
							.print-hidden { display: none !important; }
						}
					`}} />

					{/* Modal Core Architecture */}
					<motion.div
						initial={{ opacity: 0, scale: 0.9, y: 100 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.9, y: 100, transition: { duration: 0.3, ease: "circIn" } }}
						className="relative w-full max-w-[1400px] h-full sm:h-[92vh] bg-white sm:rounded-[4rem] shadow-[0_100px_200px_-50px_rgba(0,0,0,0.9)] flex flex-col sm:flex-row overflow-hidden z-[10001] border-t border-white/20"
					>
						{/* --- INTELLIGENT SIDEBAR --- */}
						<div className="w-full sm:w-[420px] bg-[#003c1b] p-10 sm:p-16 flex flex-col gap-14 print:hidden shrink-0 relative overflow-hidden">
							{/* Background Aesthetics */}
							<div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-[150px] -mr-48 -mt-48" />
							<div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[150px] -ml-48 -mb-48" />

							<div className="relative z-10 flex items-center justify-between sm:justify-start gap-6">
								<div className="w-20 h-20 bg-white rounded-[2rem] flex items-center justify-center text-[#003c1b] shadow-[0_25px_50px_-12px_rgba(0,0,10,0.4)] transform hover:scale-105 transition-transform">
									<ShoppingBag size={35} />
								</div>
								<div className="text-white">
									<h2 className="text-3xl font-black tracking-tighter leading-none italic">FRESH<span className="opacity-20 font-serif lowercase not-italic">cart</span></h2>
									<p className="text-[11px] font-black tracking-[0.5em] opacity-40 mt-3 uppercase">Smart-Fulfill System</p>
								</div>
								<button onClick={onClose} className="sm:hidden w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl text-white/50">
									<X size={24} />
								</button>
							</div>

							{/* High-End Tab Navigation */}
							<div className="relative z-10 space-y-5">
								<button
									onClick={() => setActiveTab('tracking')}
									className={cn(
										"w-full flex items-center gap-6 p-7 rounded-[2.5rem] transition-all duration-700 font-black text-xs uppercase tracking-[0.3em] group",
										activeTab === 'tracking' 
										? "bg-white text-[#003c1b] shadow-3xl shadow-black/30" 
										: "text-white/40 hover:text-white hover:bg-white/5"
									)}
								>
									<div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", activeTab === 'tracking' ? "bg-emerald-50 text-[#003c1b]" : "bg-white/5")}>
										<Truck size={22} className={cn(activeTab === 'tracking' && "animate-pulse")} />
									</div>
									<span>Live Analytics</span>
									{activeTab === 'tracking' && <motion.div layoutId="sideDot" className="ml-auto w-2 h-2 rounded-full bg-[#003c1b]" />}
								</button>
								<button
									onClick={() => setActiveTab('invoice')}
									className={cn(
										"w-full flex items-center gap-6 p-7 rounded-[2.5rem] transition-all duration-700 font-black text-xs uppercase tracking-[0.3em] group",
										activeTab === 'invoice' 
										? "bg-white text-[#003c1b] shadow-3xl shadow-black/30" 
										: "text-white/40 hover:text-white hover:bg-white/5"
									)}
								>
									<div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all", activeTab === 'invoice' ? "bg-emerald-50 text-[#003c1b]" : "bg-white/5")}>
										<FileText size={22} />
									</div>
									<span>Digital Ledger</span>
									{activeTab === 'invoice' && <motion.div layoutId="sideDot" className="ml-auto w-2 h-2 rounded-full bg-[#003c1b]" />}
								</button>
							</div>

							{/* Smart Summary Display */}
							<div className="mt-auto hidden sm:block relative z-10">
								<div className="bg-black/20 backdrop-blur-3xl rounded-[3rem] p-8 border border-white/5 space-y-8">
									<div className="flex items-center gap-5 border-b border-white/10 pb-6">
										<div className="w-14 h-14 rounded-[1.5rem] bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
											<QrCode size={26} />
										</div>
										<div>
											<p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-2">Authenticated ID</p>
											<p className="text-sm font-black text-white font-mono tracking-widest leading-none">TX-{order._id.slice(-8).toUpperCase()}</p>
										</div>
									</div>
									<div className="space-y-4">
										<div className="flex justify-between items-center px-4">
											<span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Settlement</span>
											<span className="text-white font-black text-lg italic">{order.totalOrderPrice.toLocaleString()} <small className="text-[10px] opacity-40 not-italic">EGP</small></span>
										</div>
										<div className="flex justify-between items-center px-4">
											<span className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">Network</span>
											<span className="text-emerald-400 flex items-center gap-2 font-black text-[11px]">
												<div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
												SECURE {order.paymentMethodType.toUpperCase()}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* --- UNIFIED CONTENT CANVAS --- */}
						<div className="flex-1 flex flex-col bg-[#fcfdfc] relative h-full overflow-hidden">
							{/* Content Header (Stationary) */}
							<div className="flex items-center justify-between p-10 sm:p-16 bg-white/70 backdrop-blur-3xl border-b border-slate-100 z-30 shrink-0">
								<div className="flex flex-col gap-3">
									<div className="flex items-center gap-5">
										<h3 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tighter uppercase italic leading-none truncate max-w-md">
											{activeTab === 'tracking' ? 'Protocol Status' : 'Official Document'}
										</h3>
										<div className="hidden sm:block px-4 py-1.5 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl">
											REV.0{order._id.slice(-1)}
										</div>
									</div>
									<div className="flex items-center gap-3 text-[11px] font-black text-slate-400 uppercase tracking-widest">
										<Calendar size={13} className="text-[#003c1b]" />
										Fulfillment Cycle <ChevronRight size={10} /> {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}
									</div>
								</div>
								
								<div className="flex items-center gap-5">
									{activeTab === 'invoice' && (
										<Button 
											onClick={handlePrint}
											className="h-16 px-10 rounded-[2rem] bg-slate-900 border-t border-white/10 text-white font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/30 hover:scale-[1.03] active:scale-95 transition-all gap-4 flex shrink-0"
										>
											<Printer size={20} />
											<span className="hidden lg:inline">Initialize Print</span>
										</Button>
									)}
									<button onClick={onClose} className="w-16 h-16 rounded-[2rem] bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-all hover:rotate-90">
										<X size={30} />
									</button>
								</div>
							</div>

							{/* Dynamic View Scrollable Sub-System */}
							<div className="flex-1 overflow-y-auto p-4 sm:p-16 scrollbar-hide relative z-20">
								<AnimatePresence mode="wait">
									{activeTab === 'tracking' ? (
										<motion.div
											key="tracking"
											initial={{ opacity: 0, y: 100, scale: 0.98 }}
											animate={{ opacity: 1, y: 0, scale: 1 }}
											exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
											className="space-y-16 max-w-6xl mx-auto"
										>
											{/* Logistics Dashboard Header */}
											<div className="bg-white rounded-[4.5rem] p-12 sm:p-24 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)] border border-slate-50 flex flex-col xl:flex-row items-center gap-20 relative overflow-hidden group">
												<div className="absolute inset-0 bg-gradient-to-br from-[#003c1b]/2 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
												<div className="relative z-10 w-40 h-40 bg-[#003c1b] rounded-[3.5rem] flex items-center justify-center shrink-0 shadow-[0_30px_60px_-10px_rgba(0,60,27,0.4)] group-hover:rotate-12 transition-transform duration-700">
													<Truck size={65} className="text-white" />
												</div>
												<div className="text-center xl:text-left relative z-10 flex-1">
													<div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-black uppercase tracking-[0.3em] mb-8">
														<div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
														LIVE STATUS: {steps[currentStepIndex].label}
													</div>
													<h4 className="text-6xl sm:text-8xl font-black text-slate-900 tracking-tighter leading-[0.8] italic uppercase mb-10">
														{order.isDelivered ? 'DESTINATION REACHED.' : 'EN ROUTE TO ORIGIN.'}
													</h4>
													<p className="text-xl font-medium text-slate-400 leading-relaxed max-w-4xl italic">
														Real-time monitoring engaged. Our logistics nodes are optimizing the final approach vector. Verified fresh handling protocols active.
													</p>
												</div>
											</div>

											{/* Unified Progress Timeline */}
											<div className="bg-white rounded-[5rem] p-12 sm:p-28 shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)] border border-slate-50 relative">
												<div className="relative pl-28 space-y-32">
													{/* Central Hub Line */}
													<div className="absolute left-[54px] top-12 bottom-12 w-1.5 bg-slate-50 rounded-full" />
													<motion.div 
														initial={{ height: 0 }}
														animate={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
														className="absolute left-[54px] top-12 w-1.5 bg-[#003c1b] origin-top rounded-full shadow-[0_0_40px_rgba(0,60,27,0.5)] transition-all duration-1000"
													/>

													{steps.map((step, idx) => {
														const isCompleted = step.status === 'completed';
														const isCurrent = step.status === 'current';
														const isPending = step.status === 'pending';

														return (
															<div key={idx} className="relative flex gap-20 group">
																{/* Futuristic Marker Node */}
																<div className={cn(
																	"relative z-10 w-24 h-24 rounded-[3rem] flex items-center justify-center shrink-0 border-4 transition-all duration-1000",
																	isCompleted ? "bg-[#003c1b] border-[#003c1b] text-white shadow-3xl shadow-emerald-900/40" : 
																	isCurrent ? "bg-white border-[#003c1b] text-[#003c1b] scale-125 ring-[15px] ring-emerald-50 shadow-3xl" : 
																	"bg-slate-50 border-slate-100 text-slate-200"
																)}>
																	<step.icon size={35} className={cn(isCurrent && "animate-pulse")} />
																</div>

																<div className={cn("flex-1 transition-all duration-1000", isPending && "opacity-10 grayscale")}>
																	<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-4">
																		<h5 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">{step.label}</h5>
																		{!isPending && (
																			<div className="flex items-center gap-4 bg-slate-50 px-5 py-2 rounded-2xl border border-slate-100">
																				<span className="text-[12px] font-black text-[#003c1b] uppercase tracking-widest">{step.date}</span>
																				<span className="w-1 h-3 bg-slate-200 rounded-full" />
																				<span className="text-[12px] font-black text-slate-400 uppercase tracking-widest">{step.time}</span>
																			</div>
																		)}
																	</div>
																	<p className="text-xl font-bold text-slate-300 uppercase tracking-[0.3em] italic mb-10">{step.description}</p>
																	
																	{isCurrent && (
																		<motion.div 
																			initial={{ opacity: 0, x: -30 }} 
																			animate={{ opacity: 1, x: 0 }} 
																			className="mt-12 bg-slate-900 text-white p-14 rounded-[4.5rem] relative overflow-hidden shadow-3xl border-t border-white/10"
																		>
																			<div className="absolute right-[-100px] top-[-100px] w-96 h-96 bg-[#003c1b]/30 rounded-full blur-[80px]" />
																			<div className="flex items-start gap-8 relative z-10">
																				<div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-[#003c1b] border border-white/10 shrink-0">
																					<Info size={30} />
																				</div>
																				<div>
																					<p className="text-[11px] font-black uppercase tracking-[0.6em] text-emerald-400 mb-4">Live Analytics Feed</p>
																					<p className="text-2xl font-black italic leading-[1.3] text-white max-w-3xl">
																						"Node communication successful. Tracking telemetry synchronized. Final delivery window is currently being calculated by the local dispatch engine."
																					</p>
																				</div>
																			</div>
																		</motion.div>
																	)}
																</div>
															</div>
														);
													})}
												</div>
											</div>
										</motion.div>
									) : (
										<motion.div
											key="invoice"
											initial={{ opacity: 0, scale: 0.95, filter: "blur(20px)" }}
											animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
											exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
											id="invoice-print-root"
											className="bg-white rounded-[5rem] text-slate-900 shadow-[0_80px_160px_-40px_rgba(0,0,0,0.15)] border border-slate-100 relative overflow-hidden flex flex-col mx-auto max-w-6xl"
										>
											{/* CORPORATE IDENTITY ARCHITECTURE */}
											<div className="p-16 sm:p-28 bg-slate-50/80 border-b border-slate-200 relative overflow-hidden flex flex-col xl:flex-row justify-between items-start gap-20">
												<div className="absolute top-0 left-0 w-full h-4 bg-[#003c1b]" />
												<div className="relative z-10 space-y-12">
													<div className="flex items-center gap-8">
														<div className="w-24 h-24 bg-[#003c1b] rounded-[2.5rem] flex items-center justify-center text-white shadow-3xl shadow-emerald-900/40 transform hover:scale-105 transition-transform duration-500">
															<ShoppingBag size={45} />
														</div>
														<div>
															<span className="text-6xl font-black tracking-tighter uppercase italic leading-none block">FRESH<span className="text-[#003c1b]">cart</span></span>
															<p className="text-[12px] font-black tracking-[0.6em] text-slate-400 mt-4 uppercase">Authorized Global Outlet</p>
														</div>
													</div>
													<div className="text-[15px] text-slate-400 font-black space-y-2 uppercase tracking-widest leading-relaxed">
														<p className="text-slate-900 underline decoration-emerald-500/40 underline-offset-8">HQ: DISTRICT 12 BUSINESS HUB</p>
														<p>Platinum Financial Tower, Level 112</p>
														<p>Arab Republic of Egypt, 11511</p>
														<div className="flex gap-10 pt-8 opacity-40">
															<p className="border-l-2 border-emerald-500 pl-4">VAT: 402-99-881</p>
															<p className="border-l-2 border-emerald-500 pl-4">REG: 19922-CC</p>
														</div>
													</div>
												</div>
												<div className="xl:text-right relative z-10 shrink-0">
													<div className="space-y-10">
														<div className="inline-block bg-[#000d05] px-10 py-4 rounded-[1.5rem] transform xl:rotate-3 shadow-2xl">
															<h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">OFFICIAL VOUCHER</h1>
														</div>
														<div className="space-y-3">
															<p className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic">#ID-{order._id.slice(-8).toUpperCase()}</p>
															<div className="flex xl:justify-end items-center gap-4 text-[13px] font-black text-slate-400 uppercase tracking-[0.4em] font-mono">
																<Calendar size={15} className="text-[#003c1b]" /> {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
															</div>
														</div>
													</div>
												</div>
											</div>

											{/* LOGISTICS CONTEXT GRID */}
											<div className="grid grid-cols-1 md:grid-cols-2 gap-24 p-16 sm:p-28">
												<div className="space-y-12">
													<h6 className="text-[13px] font-black uppercase tracking-[0.6em] text-[#003c1b] border-l-[10px] border-[#003c1b] pl-8 italic">Consignee Node</h6>
													<div className="space-y-4 pl-12">
														<p className="text-5xl font-black text-slate-900 tracking-tighter italic lowercase underline decoration-slate-100 underline-offset-8">{order.user.name}</p>
														<p className="text-lg font-black text-emerald-600/60 font-mono italic">{order.user.email}</p>
														<div className="flex items-center gap-3 pt-6">
															<div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
															<p className="text-sm font-black text-slate-400 uppercase tracking-widest">{order.shippingAddress?.phone}</p>
														</div>
													</div>
												</div>
												<div className="md:text-right space-y-12">
													<h6 className="text-[13px] font-black uppercase tracking-[0.6em] text-[#003c1b] md:border-r-[10px] border-[#003c1b] md:pr-8 md:border-l-0 border-l-[10px] pl-8 md:pl-0 italic flex md:justify-end items-center gap-2">Secure Destination Hub</h6>
													<div className="space-y-4 md:pr-12">
														<p className="text-4xl font-black text-slate-900 tracking-tighter leading-tight italic lowercase">{order.shippingAddress?.details}</p>
														<div className="flex md:justify-end items-center gap-5">
															<div className="px-6 py-2 bg-slate-900 text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.3em] italic">{order.shippingAddress?.city}</div>
															<span className="text-base font-black text-slate-200 uppercase tracking-[0.4em]">EGY</span>
														</div>
														<p className="text-[11px] font-black text-[#003c1b] uppercase tracking-[0.5em] pt-12 opacity-30 italic">Priority Door-to-Door Fulfillment Protocol Active</p>
													</div>
												</div>
											</div>

											{/* QUANTITY LEDGER TABLE */}
											<div className="p-16 sm:p-28 overflow-x-auto bg-slate-50/40">
												<table className="w-full text-left border-collapse min-w-[850px]">
													<thead>
														<tr className="border-b-[6px] border-[#003c1b]/10">
															<th className="py-12 px-8 text-[13px] font-black uppercase tracking-[0.5em] text-[#003c1b] italic">Unit Manifest</th>
															<th className="py-12 px-8 text-[13px] font-black uppercase tracking-[0.5em] text-[#003c1b] text-center italic">Count</th>
															<th className="py-12 px-8 text-[13px] font-black uppercase tracking-[0.5em] text-[#003c1b] text-right italic">Unit Rate</th>
															<th className="py-12 px-8 text-[13px] font-black uppercase tracking-[0.5em] text-[#003c1b] text-right italic">Balance</th>
														</tr>
													</thead>
													<tbody className="divide-y divide-slate-100">
														{order.cartItems.map((item) => (
															<tr key={item._id} className="group hover:bg-white transition-all duration-500">
																<td className="py-14 px-8">
																	<div className="flex items-center gap-10">
																		<div className="relative w-24 h-24 bg-white border-2 border-slate-100 rounded-[2rem] overflow-hidden shrink-0 shadow-2xl shadow-black/[0.05] p-3 group-hover:scale-110 transition-transform">
																			<Image 
																				src={item.product.imageCover || "https://placehold.co/400x400?text=Fresh+Cart"} 
																				alt={item.product.title} 
																				fill 
																				className="object-cover"
																				sizes="120px"
																			/>
																		</div>
																		<div>
																			<p className="text-2xl font-black text-slate-900 tracking-tighter leading-none mb-3 lowercase italic">{item.product.title}</p>
																			<div className="flex items-center gap-3">
																				<div className="w-3 h-1 bg-emerald-500 rounded-full" />
																				<p className="text-[12px] font-black uppercase tracking-widest text-slate-300 italic">Origin Label: <span className="text-emerald-950 underline decoration-emerald-200">{item.product.brand.name}</span></p>
																			</div>
																		</div>
																	</div>
																</td>
																<td className="py-14 px-8 text-center">
																	<span className="text-2xl font-black bg-slate-900 text-white w-16 h-16 inline-flex items-center justify-center rounded-[1.5rem] font-mono shadow-xl italic tracking-tighter">x{item.count}</span>
																</td>
																<td className="py-14 px-8 text-right text-xl font-bold text-slate-400 font-mono tracking-tighter italic">{item.price.toLocaleString()}</td>
																<td className="py-14 px-8 text-right text-3xl font-black text-slate-900 tracking-tighter font-mono italic">{((item.price * item.count)).toLocaleString()}</td>
															</tr>
														))}
													</tbody>
												</table>
											</div>

											{/* CONSOLIDATED SETTLEMENT BOARD */}
											<div className="mt-auto p-16 sm:p-32 bg-[#000d05] text-white rounded-t-[6rem] relative overflow-hidden invoice-summary-dark">
												{/* Tech-Art Backdrop */}
												<div className="absolute inset-0 opacity-10 pointer-events-none">
													<div className="absolute bottom-[-10%] left-[-10%] w-[120%] h-[120%] bg-emerald-900 rotate-12 blur-[120px]" />
												</div>
												
												<div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-24 items-end">
													<div className="space-y-16">
														<div className="flex items-center gap-8">
															<div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-[#000d05] shadow-[0_40px_80px_-10px_rgba(16,185,129,0.5)]">
																<ShieldCheck size={50} />
															</div>
															<div>
																<p className="text-4xl font-black italic lowercase tracking-tighter">Secure Settlement.</p>
																<p className="text-[12px] font-black text-emerald-400 uppercase tracking-[0.5em] mt-2">Node Encryption: VERIFIED-X12</p>
															</div>
														</div>
														<div className="space-y-8 text-sm font-bold text-white/40 leading-relaxed italic max-w-xl border-l-2 border-emerald-500/20 pl-10">
															<p>"This document serves as an immutable record of fulfillment. All items processed via cold-chain audited nodes. Digital signature is embedded in origin ID."</p>
															<div className="flex flex-wrap items-center gap-8 text-emerald-400 font-black uppercase tracking-[0.2em] text-xs">
																<div className="flex items-center gap-3"><CreditCard size={16} />Settlement: {order.paymentMethodType}</div>
																<div className="flex items-center gap-3"><QrCode size={16} />ID: AUTH-0992-FC</div>
															</div>
														</div>
													</div>
													<div className="space-y-14">
														<div className="space-y-7">
															<div className="flex justify-between items-center text-[12px] font-black uppercase tracking-[0.6em] text-white/30">
																<span>Gross Inventory Value</span>
																<span className="text-white font-mono text-xl italic">{subtotal.toLocaleString()} <small className="text-[10px] opacity-40 not-italic">EGP</small></span>
															</div>
															<div className="flex justify-between items-center text-[12px] font-black uppercase tracking-[0.6em] text-white/30">
																<span>Gov Compliance (14%)</span>
																<span className="text-white font-mono text-xl italic">{order.taxPrice.toLocaleString()} <small className="text-[10px] opacity-40 not-italic">EGP</small></span>
															</div>
															<div className="flex justify-between items-center text-[12px] font-black uppercase tracking-[0.6em] text-emerald-400">
																<span>Logistic Deployment</span>
																<span className="font-mono text-xl italic">{order.shippingPrice === 0 ? 'NOMINAL' : `${order.shippingPrice} EGP`}</span>
															</div>
														</div>
														<div className="pt-16 border-t border-white/10 flex justify-between items-center">
															<div className="space-y-4">
																<p className="text-[13px] font-black uppercase tracking-[0.7em] text-emerald-400 leading-none">Net Transaction Value</p>
																<p className="text-9xl font-black text-white tracking-[calc(-0.06em)] italic leading-none">{order.totalOrderPrice.toLocaleString()} <span className="text-sm uppercase opacity-40 font-bold not-italic font-sans tracking-[0.5em] ml-4 italic">EGP</span></p>
															</div>
														</div>
													</div>
												</div>
											</div>

											{/* LEGAL FOOTNOTES FOR PRINT */}
											<div className="print-only hidden print:block p-14 text-center text-[10px] text-slate-400 uppercase tracking-[0.5em] mt-10 italic">
												*** Digital Record Authenticated by FreshCart Logistics Global. No physical signature required. Valid for 14-day return protocol. ***
											</div>
										</motion.div>
									)}
								</AnimatePresence>
							</div>

							{/* Fixed Bottom Mobile Interaction Zone */}
							<div className="p-8 pb-12 bg-white border-t border-slate-200 flex gap-4 sm:hidden print:hidden shrink-0">
								{activeTab === 'invoice' ? (
									<Button className="flex-1 bg-[#003c1b] text-white rounded-[2rem] font-black h-20 shadow-3xl shadow-emerald-900/40 text-xs tracking-[0.3em] uppercase italic" onClick={handlePrint}>
										<Printer size={22} className="mr-3" />
										Print Ledger
									</Button>
								) : (
									<Button className="flex-1 bg-[#003c1b] text-white rounded-[2rem] font-black h-20 shadow-3xl shadow-emerald-900/40 text-xs tracking-[0.3em] uppercase italic" onClick={onClose}>
										Dismiss Panel
									</Button>
								)}
							</div>
						</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
}
