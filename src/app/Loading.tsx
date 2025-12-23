export default function Loading() {
	return (
		<div className="min-h-screen bg-slate-50/50 flex items-center justify-center">
			<div className="flex flex-col items-center gap-4">
				<div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-primary animate-spin" />
				<p className="text-sm text-slate-400 font-medium">Loading...</p>
			</div>
		</div>
	)
}
