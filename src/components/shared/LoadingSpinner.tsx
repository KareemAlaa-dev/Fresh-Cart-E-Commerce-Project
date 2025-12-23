import React from "react";
import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function LoadingSpinner({ className }: { className?: string }) {
	return (
		<div className={cn("flex flex-col items-center justify-center relative overflow-hidden flex-1 w-full min-h-[60vh] bg-background", className)}>
			{/* Decorative background blur */}
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
			
			<div className="relative z-10 flex flex-col items-center">
				<div className="relative mb-8">
					{/* Main Outer Ring - CSS Animation */}
					<div className="h-20 w-20 border-[3px] border-primary/20 border-t-primary rounded-full shadow-lg shadow-primary/5 animate-[spin_2s_linear_infinite]" />
					
					{/* Inner Ring - CSS Animation Reverse */}
					<div className="absolute top-2 left-2 h-16 w-16 border-[3px] border-accent/20 border-b-accent rounded-full animate-[spin_1.5s_linear_infinite_reverse]" />
					
					{/* Center Icon */}
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary">
						<ShoppingBag size={24} className="animate-pulse" />
					</div>
				</div>
				
				<div className="text-center animate-[fade-in_0.5s_ease-out]">
					<h2 className="text-2xl font-black text-foreground tracking-tighter mb-2">
						Preparing <span className="text-primary italic font-serif">Freshness</span>
					</h2>
					<p className="text-sm font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
						Curating your catalog...
					</p>
				</div>
			</div>
		</div>
	)
}
