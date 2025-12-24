import EmptyOrders from '@/components/Orders/EmptyOrders'
import { userId } from '@/helpers/getUserToken'
import { UserOrderResponse } from '@/types'

import { getUserOrders } from '@/services/api'

import Image from 'next/image'
import React from 'react'
import OrdersList from '@/components/Orders/OrdersList';

import { redirect } from 'next/navigation';

export default async function OrdersPage() {

	const id = await userId()
	
	if (!id) {
		redirect("/auth/login");
	}

	const orders: UserOrderResponse[] = await getUserOrders(id);

	if (!orders || orders.length === 0) {
		return <EmptyOrders />;
	}
	return (
		<main className="min-h-screen bg-slate-50/50 py-12 sm:py-20">
			<section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header Section */}
				<div className="mb-10 sm:mb-16">
					<h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
						My Orders
					</h1>
					<p className="text-slate-500 font-medium text-sm sm:text-base leading-relaxed max-w-2xl">
						Track and manage your recent purchases and returns.
					</p>
				</div>

				{/* Premium Orders List */}
				<OrdersList orders={orders} />
			</section>
		</main>
	)
}
