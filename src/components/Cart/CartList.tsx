"use client"
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { CartProduct, ProductCart } from '@/types'
import Image from 'next/image'
import { motion } from 'framer-motion'



interface CartListProps {
	cartItem: CartProduct<ProductCart>
	handleDeleteCartItem: (productId: string, setIsDelete: (value: boolean) => void) => void
	handleUpdate: (productId: string, count: number) => void
	handleClearCart: (setIsDelete: (value: boolean) => void) => void
}
function CartList({ cartItem, handleDeleteCartItem, handleUpdate }: CartListProps) {
	const [isDelete, setIsDelete] = useState(false)
	const [count, setCount] = useState<number>(cartItem.count)
	const [timeOutId, setTimeOutId] = useState<ReturnType<typeof setTimeout>>()


	function handleIncrease() {
        if (cartItem.product.quantity && count >= cartItem.product.quantity) return
		const newCount = count + 1
		setCount(newCount)
		clearTimeout(timeOutId)
		const id = setTimeout(() => {
			handleUpdate(cartItem.product._id, newCount)
		}, 500)
		setTimeOutId(id)

	}
	function handleDcrease() {
        if (count <= 1) return
		const newCount = count - 1
		setCount(newCount)
		clearTimeout(timeOutId)
		const id = setTimeout(() => {
			handleUpdate(cartItem.product._id, newCount)
		}, 500)
		setTimeOutId(id)
	}

	return (
		<motion.div 
            layout
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-white rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5 sm:gap-8 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500"
        >
			{/* Product Image */}
            <div className="relative w-full sm:w-32 aspect-square overflow-hidden rounded-xl bg-slate-50 shrink-0">
                <Image 
                    src={cartItem.product.imageCover || "https://placehold.co/400x400?text=No+Image"}
                    alt={cartItem.product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    sizes="(max-width:640px) 100vw, 128px"
                />
            </div>

			{/* Product Info */}
            <div className="flex-1 flex flex-col w-full text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                {cartItem.product.brand?.name || "Brand"}
                            </span>
                        </div>
                        <h2 className="text-base font-bold text-slate-900 leading-tight line-clamp-2 max-w-md">
                            {cartItem.product.title}
                        </h2>
                    </div>

                    <div className="sm:text-right shrink-0">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total</p>
                        <div className="flex items-baseline justify-center sm:justify-end gap-1">
                            <span className="text-lg font-black text-primary">{cartItem.count * cartItem.price}</span>
                            <span className="text-[9px] text-primary font-bold uppercase">EGP</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-auto">
					{/* Controls Group */}
					<div className="flex items-center gap-6">
						{/* Price per unit */}
						<div>
							<p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Unit Price</p>
							<p className="text-sm font-bold text-slate-700">{cartItem.price} <span className="text-[9px]">EGP</span></p>
						</div>

						{/* Quantity controls */}
						<div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
							<Button
								variant="ghost"
								size="icon"
								onClick={handleDcrease}
								disabled={count <= 1}
								className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm transition-all"
							>
								<Minus className="h-3 w-3" />
							</Button>
							<span className="w-8 text-center text-xs font-black text-slate-900">{count}</span>
							<Button
								variant="ghost"
								size="icon"
								onClick={handleIncrease}
								disabled={count >= (cartItem.product.quantity || 999)}
								className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm transition-all"
							>
								<Plus className="h-3 w-3" />
							</Button>
						</div>
					</div>
                    
                    <Button 
                        onClick={() => handleDeleteCartItem(cartItem.product._id, setIsDelete)}
                        disabled={isDelete}
                        variant="ghost"
                        className="w-full sm:w-auto h-10 px-4 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 font-bold uppercase tracking-wider text-[9px] gap-2 border border-slate-100 sm:border-none"
                    >
                        {isDelete ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        <span>Remove Item</span>
                    </Button>
                </div>
            </div>
		</motion.div>
	)
}
export default React.memo(CartList)