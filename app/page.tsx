'use client'
import TryOnEngine from '@/components/TryOnEngine'
import { useState } from 'react'

export default function Home() {
  const [selectedItem, setSelectedItem] = useState('https://www.swaymaverick.com/path-to-hoodie.jpg')

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* 1. Header Navigation */}
      <nav className="p-6 flex justify-between items-center border-b border-white/10">
        <h1 className="text-2xl font-black tracking-tighter">SWAY MAVERICK</h1>
        <div className="flex gap-6 text-[10px] uppercase tracking-widest text-zinc-400">
          <span>Shop</span>
          <span>Collection</span>
          <span className="text-white">Fitting Room</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-10 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* 2. Left Side: The AI Fitting Room */}
        <div className="relative">
          <div className="absolute -top-4 -left-4 bg-white text-black px-4 py-1 text-[10px] font-bold uppercase z-10">
            Live AI Preview
          </div>
          <TryOnEngine itemUrl={selectedItem} />
        </div>

        {/* 3. Right Side: Product Details */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-2">Urban Fossils Collection</p>
            <h2 className="text-5xl font-bold italic tracking-tighter mb-4">ROGUE RELIC HOODIE</h2>
            <p className="text-3xl font-light text-zinc-300">EGP 1,500.00</p>
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-4">Select Style</h3>
            <div className="flex gap-4">
              <button 
                onClick={() => setSelectedItem('YOUR_BLACK_HOODIE_URL')}
                className="w-12 h-12 rounded-full bg-zinc-800 border-2 border-white"
              ></button>
              <button 
                onClick={() => setSelectedItem('YOUR_BLUE_HOODIE_URL')}
                className="w-12 h-12 rounded-full bg-blue-900 border border-white/10"
              ></button>
            </div>
          </div>

          <button className="w-full bg-white text-black font-black py-5 rounded-full uppercase tracking-widest hover:bg-zinc-200 transition-all">
            Add to Cart — Reserve Fit
          </button>
          
          <p className="text-[10px] text-zinc-500 text-center uppercase tracking-widest">
            Free Shipping in Cairo • Secure Checkout
          </p>
        </div>
      </div>
    </main>
  )
}
