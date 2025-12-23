import Link from 'next/link'
import React from 'react'
import { ShoppingBag, Facebook, Twitter, Instagram, Mail, Phone, MapPin, ShieldCheck, Truck, Leaf } from 'lucide-react'

export default function Footer() {
	return (
		<footer className="relative border-t bg-background overflow-hidden">
			{/* Decorative background element */}
			<div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
			
			{/* Features Bar */}
			<div className="bg-primary/5 border-b">
				<div className="max-w-7xl mx-auto px-6 py-12">
					<div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
						<div className="flex flex-col items-center gap-4">
							<div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
								<Leaf className="h-7 w-7" />
							</div>
							<div>
								<h4 className="font-black text-foreground uppercase tracking-widest text-sm mb-1">100% Organic</h4>
								<p className="text-muted-foreground text-sm">Certified organic farm produce</p>
							</div>
						</div>
						<div className="flex flex-col items-center gap-4">
							<div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
								<Truck className="h-7 w-7" />
							</div>
							<div>
								<h4 className="font-black text-foreground uppercase tracking-widest text-sm mb-1">Flash Delivery</h4>
								<p className="text-muted-foreground text-sm">Within 2 hours in selective areas</p>
							</div>
						</div>
						<div className="flex flex-col items-center gap-4">
							<div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary">
								<ShieldCheck className="h-7 w-7" />
							</div>
							<div>
								<h4 className="font-black text-foreground uppercase tracking-widest text-sm mb-1">Quality Guarantee</h4>
								<p className="text-muted-foreground text-sm">100% money back freshness promise</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto px-6 pt-20 pb-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-20">
					{/* Brand Column */}
					<div className="lg:col-span-4">
						<Link href="/" className="flex items-center gap-3 group mb-8">
							<div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
								<ShoppingBag className="text-white h-5 w-5" />
							</div>
							<span className="text-xl font-black text-foreground tracking-tighter">Fresh<span className="text-primary italic font-serif">Cart</span></span>
						</Link>
						<p className="text-muted-foreground leading-relaxed mb-8 max-w-sm">
							Elevating your daily essentials with farm-to-table freshness and curated organic selections. We bring the harvest directly to your doorstep.
						</p>
						<div className="flex gap-4">
							<Link href="#" className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
								<Facebook className="h-5 w-5" />
							</Link>
							<Link href="#" className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
								<Twitter className="h-5 w-5" />
							</Link>
							<Link href="#" className="h-10 w-10 rounded-xl bg-muted/30 flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-white transition-all duration-300">
								<Instagram className="h-5 w-5" />
							</Link>
						</div>
					</div>

					{/* Links Columns */}
					<div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-12">
						<div>
							<h5 className="font-black text-foreground uppercase tracking-widest text-xs mb-6">Experience</h5>
							<ul className="space-y-4">
								<li><Link href="/products" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Digital Catalog</Link></li>
								<li><Link href="/categories" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Seasonal Picks</Link></li>
								<li><Link href="/brands" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Certified Farms</Link></li>
								<li><Link href="/wishlist" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Your Wishlist</Link></li>
							</ul>
						</div>
						<div>
							<h5 className="font-black text-foreground uppercase tracking-widest text-xs mb-6">Company</h5>
							<ul className="space-y-4">
								<li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">The Harvest Story</Link></li>
								<li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Organic Standards</Link></li>
								<li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Sustainability</Link></li>
								<li><Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium">Join the Farm</Link></li>
							</ul>
						</div>
						<div className="col-span-2 md:col-span-1">
							<h5 className="font-black text-foreground uppercase tracking-widest text-xs mb-6">Contact Us</h5>
							<ul className="space-y-4">
								<li className="flex items-center gap-3 text-sm text-muted-foreground group">
									<MapPin className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
									<span>742 Fresh Avenue, Cairo</span>
								</li>
								<li className="flex items-center gap-3 text-sm text-muted-foreground group">
									<Phone className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
									<span>+20 123 456 7890</span>
								</li>
								<li className="flex items-center gap-3 text-sm text-muted-foreground group">
									<Mail className="h-4 w-4 text-primary shrink-0 transition-transform group-hover:scale-110" />
									<span>support@freshcart.com</span>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="pt-12 border-t flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
					<p className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
						&copy; {new Date().getFullYear()} FreshCart Premium Grocer. All rights reserved.
					</p>
					<div className="flex gap-8">
						<Link href="#" className="text-[10px] font-black text-muted-foreground/40 hover:text-primary uppercase tracking-widest transition-colors">Privacy Policy</Link>
						<Link href="#" className="text-[10px] font-black text-muted-foreground/40 hover:text-primary uppercase tracking-widest transition-colors">Terms of Service</Link>
					</div>
				</div>
			</div>
		</footer>
	)
}

