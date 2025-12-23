"use client"
import Link from "next/link"
import { ArrowRight, ShoppingBag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative pt-10 pb-8 sm:pt-16 sm:pb-12 lg:pt-20 lg:pb-16 antialiased overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">
        
        <div className="max-w-7xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-emerald-800 text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-3 sm:mb-4">
            <Sparkles size={10} className="text-emerald-500 fill-emerald-500" />
            <span>Discover Freshness Reimagined</span>
          </div>

          {/* Heading */}
          <h1 className="
            text-[2.1rem] leading-[1.05]
            xs:text-[2.5rem]
            sm:text-5xl
            md:text-6xl
            lg:text-7xl
            xl:text-8xl
            font-black tracking-tight text-emerald-950 mb-3
          ">
            Your Daily Dose <br />
            <span className="font-serif italic text-emerald-800">
              of Organic Life
            </span>
          </h1>

          {/* Description */}
          <p className="
            text-sm
            xs:text-base
            sm:text-lg
            md:text-xl
            text-emerald-900/60
            max-w-[260px]
            xs:max-w-sm
            sm:max-w-xl
            md:max-w-2xl
            mx-auto
            mb-6
            leading-relaxed
            font-medium
          ">
            Experience the finest selection of organic produce, premium pantry staples, and artisan goods delivered straight to your door with unmatched elegance.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-5">
            
            <Link href="/products" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="
                  w-full sm:w-auto
                  h-12 sm:h-14
                  px-6 sm:px-10
                  rounded-full
                  bg-[#003c1b]
                  hover:bg-[#003c1b]/90
                  text-white
                  font-bold
                  shadow-lg shadow-emerald-900/10
                  transition-all
                  hover:scale-[1.03]
                "
              >
                <span className="flex items-center gap-2">
                  Start Exploring
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>

            <Link href="/categories" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="
                  w-full sm:w-auto
                  h-12 sm:h-14
                  px-6 sm:px-8
                  rounded-full
                  border-slate-200
                  bg-white
                  hover:bg-slate-50
                  font-bold
                  transition-all
                "
              >
                <ShoppingBag className="h-4 w-4 mr-2 text-emerald-700" />
                Browse Categories
              </Button>
            </Link>

          </div>
        </div>
      </div>
    </section>
  )
}
