import { Category, Product } from '@/types';
import { Action } from '@/reducers/productReducer';
import { getAllCategories } from '@/services/api'
import { CategoryResponse } from '@/types';
import React, { useEffect, useState, useMemo } from 'react'
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface SidebarProp {
	dispatch: (action: Action) => void
	activeCategory?: string
	products: Product[]
}

export default function Sidebar({ dispatch, activeCategory = "All", products }: SidebarProp) {
	const [categories, setCategories] = useState<Category[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const catRes: CategoryResponse = await getAllCategories();
				const allCategory: Category = {
					_id: "all",
					name: "All",
					slug: "all",
					image: "",
				};
				if (catRes?.data) {
					setCategories([allCategory, ...catRes.data]);
				} else {
					setCategories([allCategory]);
				}
			} catch (error) {
				console.error("Sidebar: Failed to fetch categories:", error);
				setCategories([{ _id: "all", name: "All", slug: "all", image: "" }]);
			}
		};
		fetchData();
	}, []);

	const filteredCategories = useMemo(() => {
		if (categories.length === 0) return [];
		return categories.filter(cat => {
			if (cat.name === "All") return true;
			return products.some(product => product.category?._id === cat._id || product.category?.name === cat.name);
		});
	}, [categories, products]);

	return (
		<aside className="w-full h-fit">
			<div className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-sm">
				<h3 className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4 sm:mb-6">
					Filter by Category
				</h3>
				
				<div className="flex flex-row lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide -mx-2 px-2 lg:mx-0 lg:px-0">
					{filteredCategories.map((cat) => {
						const isActive = activeCategory === cat.name;
						return (
							<button
								key={cat._id}
								onClick={() => dispatch({ type: "FILTER_BY_CATEGORY", payload: cat.name })}
								className={cn(
									"flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 group text-[11px] sm:text-sm whitespace-nowrap shrink-0 w-auto lg:w-full",
									isActive 
										? "bg-slate-900 text-white shadow-md shadow-slate-200" 
										: "text-slate-600 bg-white hover:bg-slate-50 hover:text-slate-900 border border-slate-200 lg:border-none"
								)}
							>
								<span className="font-bold tracking-tight">{cat.name}</span>
								{/* Count or Icon could go here */}
								<ChevronRight className={cn(
									"hidden lg:block h-3.5 w-3.5 transition-transform duration-300",
									isActive ? "translate-x-0" : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
								)} />
							</button>
						);
					})}
				</div>

				{/* Promotional Banner - Hide on small mobile to save space */}
				<div className="mt-8 p-5 rounded-2xl bg-emerald-50 border border-emerald-100/50 hidden sm:block">
					<p className="text-[10px] text-emerald-600 font-black uppercase tracking-widest mb-2">Exclusive Offer</p>
					<p className="text-xs text-emerald-900 font-bold leading-relaxed">Get 10% off on your first organic basket.</p>
					<button className="mt-3 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline">
						Learn More →
					</button>
				</div>
			</div>
		</aside>
	)
}
