"use client"

import { WishListResponse, Product } from '@/types'
import React, { useContext, useEffect, useState } from 'react'
import { WishlistContext } from '@/Context/WishListContext'
import { getWishlist, removeFromWishlist } from '@/services/api'
import toast from 'react-hot-toast'
import EmptyWishlist from './EmptyWishList'
import WishlistCard from './WishlistCard'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { Loader2, Trash2, Heart } from 'lucide-react'

interface InnerWishListProps {
	wishListProducts: WishListResponse
}

export default function InnerWishList({ wishListProducts }: InnerWishListProps) {
	const [wishlist, setWishlist] = useState<WishListResponse>(wishListProducts)
    const [isClearing, setIsClearing] = useState(false)
	const { setWishlistCount, setWishlistProductIds } = useContext(WishlistContext)

	// Sync wishlist context on mount and data change
	useEffect(() => {
		if (wishlist) {
			setWishlistCount(wishlist.count)
			setWishlistProductIds(wishlist.data?.map((item: Product) => item._id) || [])
		}
	}, [wishlist, setWishlistCount, setWishlistProductIds])

	// Delete item from wishlist
	async function handleRemoveFromWishList(productId: string, setIsRemoving: (value: boolean) => void) {
		setIsRemoving(true)
		
		try {
			const data = await removeFromWishlist(productId)
			if (data.status === "success") {
				toast.success("Removed from wishlist")
				// Refresh data
				const newWishlistData = await getWishlist()
				setWishlist(newWishlistData)
			} else {
				toast.error("Failed to remove item")
			}
		} catch (error) {
			console.error("Remove from wishlist error:", error)
			toast.error("Something went wrong")
		} finally {
			setIsRemoving(false)
		}
	}

    // Clear all items
    async function handleClearWishlist() {
        if (!wishlist?.data?.length) return;
        setIsClearing(true);
        const toastId = toast.loading("Clearing wishlist...");
        
        try {
            // Since there is no bulk clear API, we remove items one by one in parallel
            // Note: In a real app, you should request a backend endpoint for this.
            const promises = wishlist.data.map(item => removeFromWishlist(item._id));
            await Promise.all(promises);
            
            const newWishlistData = await getWishlist();
            setWishlist(newWishlistData);
            toast.success("Wishlist cleared", { id: toastId });
        } catch (error) {
            console.error("Clear wishlist error:", error);
            toast.error("Failed to clear wishlist", { id: toastId });
        } finally {
            setIsClearing(false);
        }
    }

	const isEmpty = !wishlist?.data || wishlist.data.length === 0

	return (
		<main className="min-h-screen pb-24 bg-slate-50/50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
                <AnimatePresence mode="wait">
                    {isEmpty ? (
                        <EmptyWishlist />
                    ) : (
                        <section>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
                                <div className="text-center sm:text-left">
                                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-3 justify-center sm:justify-start">
                                        <Heart className="text-primary fill-primary/10" />
                                        My Wishlist
                                    </h1>
                                    <p className="text-slate-500 font-medium mt-1">
                                        You have {wishlist.count} {wishlist.count === 1 ? "item" : "items"} saved
                                    </p>
                                </div>

                                <Button 
                                    variant="outline"
                                    size="lg"
                                    onClick={handleClearWishlist}
                                    disabled={isClearing}
                                    className="rounded-xl border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-colors w-full sm:w-auto"
                                >
                                    {isClearing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
                                    Clear Wishlist
                                </Button>
                            </div>
                            
                            <div className="flex flex-col gap-4">
                                <AnimatePresence mode="popLayout">
                                    {wishlist.data.map((product) => (
                                        <motion.div 
                                            key={product._id}
                                            layout
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <WishlistCard 
                                                product={product} 
                                                onRemove={handleRemoveFromWishList}
                                            />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </section>
                    )}
                </AnimatePresence>
			</div>
		</main>
	)
}
