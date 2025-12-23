"use client"

import { useEffect } from "react"
import { ping } from "@/services/api"

/**
 * Warmup Component
 * 
 * Simple warmup that pre-establishes Server Action connections.
 * Runs once on mount to reduce first-interaction latency.
 * Optimized delay to not impact Core Web Vitals.
 */
export default function Warmup() {
	useEffect(() => {
		// Fire warmup call after render is complete to not block critical path
		const timer = setTimeout(() => {
			ping().catch(() => {})
		}, 1000) // Optimized delay for better INP
		
		return () => clearTimeout(timer)
	}, [])

	return null
}
