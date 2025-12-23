"use client"

import React from 'react'
import dynamic from 'next/dynamic'
import Hero from './Hero'

// Lazy load below-the-fold components for better performance
const Features = dynamic(() => import('./Features'), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true,
})

const SmartShowcase = dynamic(() => import('./SmartShowcase'), {
  loading: () => <div className="min-h-[400px]" />,
  ssr: true,
})

export default function HomeContainer() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Features />
      <SmartShowcase />
    </main>
  )
}
