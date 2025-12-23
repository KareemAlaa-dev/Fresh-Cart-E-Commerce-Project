import React from 'react'
import { Button } from './ui/button'
import { LayoutGrid, List } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ViewmodeProps {
	viewMode: "grid" | "list",
	setViewMode: React.Dispatch<React.SetStateAction<"grid" | "list">>
}
export default function Viewmode({ viewMode, setViewMode }: ViewmodeProps) {
	return (
		<div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-xl border border-slate-100 w-fit">
			<Button
				variant="ghost"
				size="sm"
				onClick={() => setViewMode("grid")}
				className={cn(
					"h-8 px-3 rounded-lg gap-2 transition-all duration-300",
					viewMode === "grid" ? "bg-white shadow-sm text-slate-900 hover:bg-white" : "text-slate-500 hover:bg-transparent"
				)}
				aria-label="Grid view"
			>
				<LayoutGrid className="h-3.5 w-3.5" />
				<span className="text-xs font-bold uppercase tracking-wider">Grid</span>
			</Button>

			<Button
				variant="ghost"
				size="sm"
				onClick={() => setViewMode("list")}
				className={cn(
					"h-8 px-3 rounded-lg gap-2 transition-all duration-300",
					viewMode === "list" ? "bg-white shadow-sm text-slate-900 hover:bg-white" : "text-slate-500 hover:bg-transparent"
				)}
				aria-label="List view"
			>
				<List className="h-3.5 w-3.5" />
				<span className="text-xs font-bold uppercase tracking-wider">List</span>
			</Button>
		</div>
	)
}
