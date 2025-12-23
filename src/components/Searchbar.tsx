"use client"
import { Action } from '@/reducers/productReducer'
import React from 'react'
import { Input } from './ui/input'
import { Search } from 'lucide-react'

interface SearchbarProps {
	dispatch: (action: Action) => void
}
export default function Searchbar({ dispatch }: SearchbarProps) {
	return (
		<div className="relative w-full group">
			<Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
			<Input
				type="text"
				placeholder="Find something fresh..."
				className="w-full pl-11 pr-4 h-11 bg-slate-50 border-transparent rounded-xl focus:bg-white focus:border-slate-200 focus:ring-4 focus:ring-slate-100 transition-all text-sm font-medium"
				onChange={(e) => dispatch({ type: "SEARCH", payload: e.target.value })}
			/>
		</div>
	)
}
