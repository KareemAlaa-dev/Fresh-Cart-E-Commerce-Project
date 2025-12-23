import React from 'react'
import { Button } from '../ui/button'
import { GetCartResponse } from '@/types'
import Link from 'next/link'
interface CartSummaryProps {
	cart: GetCartResponse
}
export default function CartSummary({ cart }: CartSummaryProps) {
	return (
		<aside className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 h-fit shadow-sm sticky top-24">
			<h3 className="text-xl font-black text-slate-900 mb-6 tracking-tight">Order Summary</h3>
			
            <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>Subtotal</span>
                    <span className="text-slate-900">{cart.data.totalCartPrice} EGP</span>
                </div>
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span>Shipping</span>
                    <span className="text-emerald-500">Free</span>
                </div>
                
                <div className="flex justify-between items-baseline pt-6 border-t border-slate-50">
                    <span className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Total</span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-slate-900">{cart.data.totalCartPrice}</span>
                        <span className="text-xs font-black text-slate-400">EGP</span>
                    </div>
                </div>
            </div>

			<Button asChild className="w-full h-12 mt-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-slate-200">
				<Link href={`/checkout/${cart.data._id}`}>Secure Checkout</Link>
			</Button>
            
            <Link href="/products" className="block text-center mt-4 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors">
                Continue Shopping
            </Link>
		</aside >
	)
}
