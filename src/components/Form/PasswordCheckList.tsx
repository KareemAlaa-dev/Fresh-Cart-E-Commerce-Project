import { passwordChecks } from "@/helpers/passwordChecks";
import { Check, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
	password: string;
}

export function PasswordChecklist({ password }: Props) {
	return (
		<div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 mt-2">
			<p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3">Security Requirements</p>
			<ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4">
				{passwordChecks.map((c, i) => {
					const passed = c.test(password || "");
					return (
						<motion.li
							key={i}
							initial={false}
							animate={{
								color: passed ? "#059669" : "#94a3b8",
							}}
							className="flex items-center gap-2 text-[11px] font-bold transition-colors duration-300"
						>
							<div className="relative w-4 h-4 flex items-center justify-center shrink-0">
								<AnimatePresence mode="wait">
									{passed ? (
										<motion.div
											key="passed"
											initial={{ scale: 0, rotate: -90 }}
											animate={{ scale: 1, rotate: 0 }}
											exit={{ scale: 0, rotate: 90 }}
											className="bg-emerald-100 text-emerald-600 rounded-full p-0.5"
										>
											<Check size={10} strokeWidth={4} />
										</motion.div>
									) : (
										<motion.div
											key="failed"
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											className="text-slate-300"
										>
											<Circle size={10} strokeWidth={3} />
										</motion.div>
									)}
								</AnimatePresence>
							</div>
							<span className="leading-none">{c.label}</span>
						</motion.li>
					);
				})}
			</ul>
		</div>
	);
}
