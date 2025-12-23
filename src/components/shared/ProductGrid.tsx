"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ProductGridProps {
  children: React.ReactNode
  className?: string
  viewMode?: "grid" | "list"
}

/**
 * A shared responsive grid for Product Cards.
 * Rule: 
 * - < 425px: 1 column
 * - >= 425px: 2 columns (xs)
 * - >= 1024px: 3 columns (lg)
 * - >= 1280px: 4 columns (xl)
 */
export const ProductGrid = ({ children, className, viewMode = "grid" }: ProductGridProps) => {
  return (
    <div 
      className={cn(
        "grid gap-4 sm:gap-8 w-full transition-all duration-300",
        viewMode === "grid" 
          ? "grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" // Global rule: 1 col < 425px, 2 col >= 425px
          : "grid-cols-1",
        className
      )}
    >
      {children}
    </div>
  )
}

export default React.memo(ProductGrid)
