"use client"

import CartList from './CartList'
import CartSummary from './CartSummary'
import { GetCartResponse, CartProduct, ProductCart } from '@/types'
import EmptyCart from './EmptyCart'
import { Button } from '../ui/button'
import { Loader2, Trash2 } from 'lucide-react'
import useCartActions from '@/Hooks/useCartActions'

interface InnerCartProps {
	cartData: GetCartResponse

}
export default function InnerCart({ cartData }: InnerCartProps) {

	const { cart, isLoading, handleDeleteCartItem, handleUpdateCart, handleClearCart } = useCartActions(cartData)

	if (!cart?.data?.products || cart.data.products.length === 0) {
		return <EmptyCart />
	}


	return (
		<>
			<section>

				<p className="text-gray-500 mb-4">You have {cart?.numOfCartItems} {cart?.numOfCartItems == 1 ? "item" : "items"} in your cart</p>
				<div className="grid lg:grid-cols-3 gap-8">
					{/* products list */}
					<div className="lg:col-span-2  space-y-4">

						{
							cart?.data?.products?.map((item: CartProduct<ProductCart>) =>
								<CartList key={item._id} cartItem={item} handleDeleteCartItem={handleDeleteCartItem} handleUpdate={handleUpdateCart} handleClearCart={handleClearCart} />
							)

						}
					</div>

					{/* summary box */}
					<div className="flex flex-col gap-4">
						<CartSummary cart={cart} />
						<Button 
							variant="outline"
							className="w-full h-12 border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all duration-300 rounded-xl font-bold uppercase tracking-wider text-[10px] group"
							onClick={handleClearCart}
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 className='animate-spin mr-2 h-4 w-4' />
							) : (
								<Trash2 className="mr-2 h-4 w-4 text-slate-400 group-hover:text-red-500 transition-colors" />
							)}
							Clear Shopping Cart
						</Button>
					</div>
				</div>
			</section>
		</>
	)
}
