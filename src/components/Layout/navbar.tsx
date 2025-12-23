"use client"

import Link from "next/link"
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { BsCart3 } from 'react-icons/bs';
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import { cartContext } from "@/Context/CartContext";
import { WishlistContext } from "@/Context/WishListContext";
import { Heart, Loader2, LogOut, ShoppingBag, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

export default function Navbar() {
	const { cartCount } = useContext(cartContext)
	const { wishListCount } = useContext(WishlistContext)
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
	const pathname = usePathname()
	const { status } = useSession()
	const [isMounted, setIsMounted] = useState(false)

	useEffect(() => {
		setIsMounted(true)
	}, [])

	const links = [
		{ href: "/products", label: "Products" },
		{ href: "/brands", label: "Brands" },
		{ href: "/categories", label: "Categories" },
		{ href: "/allorders", label: "Orders" },
	]

	return (
		<>
			<nav suppressHydrationWarning className="w-full sticky top-0 left-0 z-50 px-3 sm:px-6 lg:px-8 py-3 sm:py-4">
				<div 
					suppressHydrationWarning
					className="max-w-7xl mx-auto glass rounded-2xl sm:rounded-3xl h-14 sm:h-20 px-4 sm:px-8 flex items-center justify-between shadow-2xl shadow-primary/10"
				>
					{/* Logo */}
					<Link href="/" className="flex items-center gap-1.5 sm:gap-3 group transition-transform hover:scale-105 shrink-0">
						<div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary rounded-lg sm:rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 group-hover:rotate-6 transition-transform">
							<ShoppingBag className="text-white h-4 w-4 sm:h-6 sm:w-6" />
						</div>
						<div className="flex flex-col">
							<span className="text-sm sm:text-xl font-black text-foreground tracking-tighter leading-none">Fresh<span className="text-primary italic font-serif">Cart</span></span>
							<span className="text-[7px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mt-0.5">Premium Grocer</span>
						</div>
					</Link>

					{/* Desktop Navigation */}
					<NavigationMenu className="hidden lg:flex">
						<NavigationMenuList className="gap-2">
							{links.map((link) => {
								const isActive = pathname.startsWith(link.href)
								return (
									<NavigationMenuItem key={link.href}>
										<NavigationMenuLink asChild>
											<Link
												href={link.href}
												className={cn(
													"px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300",
													isActive 
														? "bg-primary/10 text-primary shadow-inner" 
														: "text-muted-foreground hover:bg-white hover:text-primary"
												)}
											>
												{link.label}
											</Link>
										</NavigationMenuLink>
									</NavigationMenuItem>
								)
							})}
						</NavigationMenuList>
					</NavigationMenu>

					{/* Actions */}
					<div className="flex items-center gap-1 sm:gap-2 min-w-[80px] sm:min-w-[150px] justify-end">
						{isMounted ? (
							<AnimatePresence mode="wait">
								{status === "loading" ? (
									<motion.div
										key="loading"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
									>
										<Loader2 className="animate-spin text-primary h-4 w-4 sm:h-5 sm:w-5" />
									</motion.div>
								) : status === "authenticated" ? (
									<motion.div 
										key="auth"
										initial={{ opacity: 0, scale: 0.95 }}
										animate={{ opacity: 1, scale: 1 }}
										className="flex items-center gap-1 sm:gap-2"
									>
										{/* Wishlist */}
										<Button asChild variant="ghost" size="icon" className="relative h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl bg-white hover:bg-primary/5 transition-all group shadow-sm hover:shadow-lg hover:shadow-primary/20 border border-slate-100/50 hover:-translate-y-0.5">
											<Link href="/wishlist">
												<Heart className="h-4 w-4 sm:h-6 sm:w-6 text-foreground group-hover:text-primary transition-colors" />
												{wishListCount > 0 && (
													<motion.span
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														className="absolute top-0 right-0 sm:top-1 sm:right-1 bg-primary text-white text-[7px] sm:text-[10px] font-black min-w-[0.8rem] sm:min-w-[1.25rem] h-3.5 sm:h-5 px-1 sm:px-1.5 rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border sm:border-2 border-white translate-x-1/4 -translate-y-1/4"
													>
														{wishListCount}
													</motion.span>
												)}
											</Link>
										</Button>

										{/* Cart */}
										<Button asChild variant="ghost" size="icon" className="relative h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl bg-white hover:bg-primary/5 transition-all group shadow-sm hover:shadow-lg hover:shadow-primary/20 border border-slate-100/50 hover:-translate-y-0.5">
											<Link href="/cart">
												<BsCart3 className="h-4 w-4 sm:h-6 sm:w-6 text-foreground group-hover:text-primary transition-colors" />
												{cartCount > 0 && (
													<motion.span
														initial={{ scale: 0 }}
														animate={{ scale: 1 }}
														className="absolute top-0 right-0 sm:top-1 sm:right-1 bg-primary text-white text-[7px] sm:text-[10px] font-black min-w-[0.8rem] sm:min-w-[1.25rem] h-3.5 sm:h-5 px-1 sm:px-1.5 rounded-full flex items-center justify-center shadow-lg shadow-primary/40 border sm:border-2 border-white translate-x-1/4 -translate-y-1/4"
													>
														{cartCount}
													</motion.span>
												)}
											</Link>
										</Button>

										{/* Logout */}
										<Button 
											variant="ghost" 
											size="icon" 
											className="h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl bg-white hover:bg-red-50 text-muted-foreground hover:text-red-500 transition-all shadow-sm hover:shadow-lg hover:shadow-red-500/10 border border-slate-100/50 hover:-translate-y-0.5" 
											onClick={() => signOut({ callbackUrl: "/" })}
										>
											<LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
										</Button>
									</motion.div>
								) : (
									<motion.div 
										key="guest"
										initial={{ opacity: 0, x: 10 }}
										animate={{ opacity: 1, x: 0 }}
										className="flex items-center gap-2 sm:gap-4 px-1 sm:px-2"
									>
										<Link href="/auth/login" className="text-[10px] sm:text-sm font-bold text-muted-foreground hover:text-primary transition-colors">Login</Link>
										<Link href="/auth/register">
											<Button className="rounded-lg sm:rounded-2xl h-7 sm:h-11 px-2.5 sm:px-6 text-[9px] sm:text-sm font-bold shadow-lg shadow-primary/20">Join</Button>
										</Link>
									</motion.div>
								)}
							</AnimatePresence>
						) : (
							<div className="h-8 w-20 sm:h-12 sm:w-32" /> // Fixed placeholder to prevent layout shift
						)}

						{/* Mobile Menu Toggle */}
						<Button 
							variant="ghost" 
							size="icon" 
							className="lg:hidden h-8 w-8 sm:h-12 sm:w-12 rounded-lg sm:rounded-2xl bg-white" 
							onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
						>
							{isMobileMenuOpen ? <X className="h-4 w-4 sm:h-6 sm:w-6" /> : <Menu className="h-4 w-4 sm:h-6 sm:w-6" />}
						</Button>
					</div>
				</div>
			</nav>

			{/* Mobile Navigation */}
			<AnimatePresence>
				{isMobileMenuOpen && (
					<motion.div 
						initial={{ opacity: 0, y: -20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="lg:hidden fixed top-[72px] sm:top-[110px] left-3 sm:left-6 right-3 sm:right-6 z-40"
					>
						<div className="glass rounded-[2rem] p-6 shadow-2xl">
							<div className="flex flex-col gap-4">
								{links.map((link) => {
									const isActive = pathname.startsWith(link.href)
									return (
										<Link
											key={link.href}
											href={link.href}
											onClick={() => setIsMobileMenuOpen(false)}
											className={cn(
												"p-4 rounded-2xl text-lg font-bold transition-all",
												isActive ? "bg-primary text-white" : "text-foreground hover:bg-accent/10"
											)}
										>
											{link.label}
										</Link>
									)
								})}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	)
}
