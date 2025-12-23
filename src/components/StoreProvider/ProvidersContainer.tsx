"use client"
import CartContextProvider from '@/Context/CartContext'
import WishlistContextProvider from '@/Context/WishListContext'
import { store } from '@/redux/store'
import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'
import { Provider } from 'react-redux'

import { Session } from 'next-auth'

export default function ProvidersContainer({ children, session }: { children: ReactNode, session?: Session | null }) {
	return (
		<SessionProvider session={session}>
			<Provider store={store}>
				<WishlistContextProvider>
					<CartContextProvider>
						{children}
					</CartContextProvider>
				</WishlistContextProvider>
			</Provider>
		</SessionProvider>
	)
}
