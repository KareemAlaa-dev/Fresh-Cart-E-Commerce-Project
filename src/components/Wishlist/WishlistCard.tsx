"use client"
import React, { useState } from 'react'
import { Product } from '@/types'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2, ShoppingCart, Star } from 'lucide-react'
import { Button } from '../ui/button'
import AddToCartBtn from '../Cart/AddToCartBtn'
import { motion } from 'framer-motion'

interface WishlistCardProps {
    product: Product
    onRemove: (productId: string, setIsRemoving: (val: boolean) => void) => void
}

export default function WishlistCard({ product, onRemove }: WishlistCardProps) {
    const [isRemoving, setIsRemoving] = useState(false)
    const router = useRouter();

    const handleCardClick = () => {
        router.push(`/products/${product.id}`);
    };

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={handleCardClick}
            className="group relative bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 sm:gap-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 cursor-pointer"
        >
            {/* Product Image - Matched CartList size (w-32) */}
            <div className="relative w-full sm:w-32 aspect-square overflow-hidden rounded-xl bg-slate-50 shrink-0">
                <Image 
                    src={product.imageCover || "https://placehold.co/400x400?text=No+Image"}
                    alt={product.title}
                    fill
                    className="object-contain p-2 group-hover:scale-110 transition-transform duration-700 ease-out"
                    sizes="(max-width:640px) 100vw, 128px"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {product.brand?.name || "Brand"}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded-md">
                                <Star size={10} fill="currentColor" />
                                <span>{product.ratingsAverage}</span>
                            </div>
                        </div>
                        <h2 className="text-base font-bold text-slate-900 leading-tight line-clamp-2 max-w-md group-hover:text-primary transition-colors">
                            {product.title}
                        </h2>
                    </div>

                    <div className="sm:text-right shrink-0">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Price</p>
                        <div className="flex items-baseline justify-center sm:justify-end gap-1">
                            <span className="text-lg font-black text-slate-900">{product.price}</span>
                            <span className="text-[9px] text-slate-500 font-bold uppercase">EGP</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
                    {/* Add to Cart Actions (Replacing Quantity Controls from Cart) */}
                    <div className="w-full sm:w-auto" onClick={(e) => e.stopPropagation()}>
                         <AddToCartBtn productId={product._id} productQuantity={product.quantity} />
                    </div>
                    
                    {/* Remove Button */}
                    <Button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemove(product._id, setIsRemoving);
                        }}
                        disabled={isRemoving}
                        variant="ghost"
                        className="w-full sm:w-auto h-10 px-4 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 font-bold uppercase tracking-wider text-[9px] gap-2 border border-slate-100 sm:border-none"
                    >
                        {isRemoving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        <span>Remove Item</span>
                    </Button>
                </div>
            </div>
            
            {/* Status Indicator (Mobile Only) */}
            <div className="absolute top-4 right-4 sm:hidden">
                 <div className="bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-tighter px-2 py-1 rounded-md">
                    In Stock
                </div>
            </div>
        </motion.div>
    )
}
