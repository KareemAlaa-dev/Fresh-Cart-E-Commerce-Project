import { useCallback, useContext, useEffect, useState } from 'react'
import { cartContext } from '@/Context/CartContext'
import { GetCartResponse } from '@/types'
import { clearCart, deleteCartItem, getUserCart, updateCartProductQuantity } from '@/services/api'
import toast from 'react-hot-toast'


export default function useCartActions(initialCart: GetCartResponse) {
	const [cart, setCart] = useState<GetCartResponse>(initialCart)
	const [isLoading, setIsLoading] = useState(false);
	const { setCartCount } = useContext(cartContext)





	useEffect(() => {
		setCartCount(cart.numOfCartItems)
	}, [cart, setCartCount])

	const refreshCart = useCallback(async () => {
		const newCart = await getUserCart();
		setCart(newCart);
	}, []);
	// delete item from cart
	const handleDeleteCartItem = useCallback(async (productId: string, setIsDelete: (value: boolean) => void) => {
		let toastId: string | undefined;
		try {
			setIsDelete(true);
			setIsLoading(true);
			toastId = toast.loading("Removing item...");
			const res = await deleteCartItem(productId);
			if (res.status === "success") {
				toast.success("Item removed successfully!", { id: toastId });
				await refreshCart();
			} else {
				toast.error("Failed to remove item", { id: toastId });
			}
		} catch (error) {
			toast.error("Something went wrong", { id: toastId });
		} finally {
			setIsDelete(false);
			setIsLoading(false);
		}
	}, [refreshCart]);

	const handleUpdateCart = useCallback(async (productId: string, count: number) => {
		await updateCartProductQuantity(productId, count);
		await refreshCart();
	}, [refreshCart]);

	const handleClearCart = useCallback(async () => {
		let toastId: string | undefined;
		try {
			setIsLoading(true);
			toastId = toast.loading("Clearing cart...");
			await clearCart();
			toast.success("Cart cleared!", { id: toastId });
			await refreshCart();
		} catch (error) {
			toast.error("Failed to clear cart", { id: toastId });
		} finally {
			setIsLoading(false);
		}
	}, [refreshCart]);



	return { cart, isLoading, handleDeleteCartItem, handleUpdateCart, handleClearCart };
}
