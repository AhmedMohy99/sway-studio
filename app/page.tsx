'use client'
import { useState } from 'react'
import { COLLECTIONS, CONTACT_LINKS } from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'

export default function Home() {
  const [activeTab, setActiveTab] = useState('aero-collection')
  const currentCollection = COLLECTIONS.find(c => c.id === activeTab) || COLLECTIONS[0]
  const [selectedProduct, setSelectedProduct] = useState(currentCollection.products[0])
  const [selectedSize, setSelectedSize] = useState('L')
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)

  const SIZES = ['S', 'M', 'L', 'XL', '2XL']

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-cyan-400">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="w-full bg-cyan-400 py-2 overflow-hidden whitespace-nowrap border-b border-black">
        <div className="flex animate-marquee gap-10">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-[9px] font-black uppercase text-black tracking-[0.3em]">
              Crafted For The Maverick • Designed for those who CREATE THEIR OWN RULES • 
            </span>
          ))}
        </div>
      </div>

      {/* 2. HEADER */}
      <nav className="p-8 flex justify-between items-center px-12 border-b border-white/5">
        <div className="flex items-center gap-4">
           <h1 className="text-2xl font-[1000] italic tracking-tighter text-cyan-400 leading-none">SWAY</h1>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
          <span className="hover:text-cyan-400 cursor-pointer transition">Home</span>
          <span className="text-white cursor-pointer">Shop</span>
          <span className="hover:text-cyan-400 cursor-pointer transition">Our Story</span>
          <span className="hover:text-cyan-400 cursor-pointer transition">Size Guide</span>
        </div>
      </nav>

      {/* 3. CATEGORY SWITCHER */}
      <div className="px-12 py-6 flex gap-4 overflow-x-auto no-scrollbar border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-40">
        {COLLECTIONS.map(col => (
          <button 
            key={col.id}
            onClick={() => {
              setActiveTab(col.id);
              setSelectedProduct(col.products[0]);
            }}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
              activeTab === col.id ? 'bg-cyan-400 border-cyan-400 text-black' : 'border-white/10 text-zinc-600'
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {/* 4. THE PRODUCT VIEW (SPLIT SCREEN) */}
      <div className="grid lg:grid-cols-2 min-h-[85vh]">
        {/* LEFT: IMAGE VIEW */}
        <div className="p-10 flex flex-col items-center justify-center border-r border-white/5 relative group">
           <div className="w-full max-w-lg aspect-[3/4] bg-zinc-900 rounded-[40px] overflow-hidden relative border border-white/10">
              <img 
                src={selectedProduct.image} 
                alt={selectedProduct.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <button 
                onClick={() => setIsTryOnOpen(true)}
                className="absolute bottom-10 left-10 right-10 bg-black/80 backdrop-blur-md border border-cyan-400/30 text-cyan-400 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_30px_rgba(0,245,255,0.2)]"
              >
                Launch Virtual Fitting
              </button>
           </div>
           <p className="mt-8 text-[9px] uppercase tracking-[0.5em] text-zinc-600">Hover to try on AI engine</p>
        </div>

        {/* RIGHT: DETAILS VIEW */}
        <div className="p-20 flex flex-col justify-center">
          <div className="mb-12">
            <h2 className="text-6xl font-[1000] italic tracking-tighter uppercase leading-none mb-4">{selectedProduct.name}</h2>
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-black tracking-widest text-zinc-600 uppercase">SKU: {selectedProduct.sku || 'SWAY-OTOW-26'}</span>
              <span className="h-[1px] w-10 bg-zinc-800"></span>
              <span className="text-cyan-400 text-[10px] font-black tracking-widest uppercase">In Stock</span>
            </div>
          </div>

          <div className="mb-12">
            <span className="text-4xl font-[1000] italic tracking-tighter">EGP {selectedProduct.price}.00</span>
          </div>

          {/* COLOR SELECTOR */}
          <div className="mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Variations:</p>
            <div className="flex gap-4">
              {currentCollection.products.map((p: any, i: number) => (
                <button key={i} onClick={() => setSelectedProduct(p)} className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedProduct.name === p.name ? 'border-cyan-400' : 'border-white/5 opacity-40 hover:opacity-100'}`}>
                  <img src={p.image} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* SIZE SELECTOR */}
          <div className="mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-6">Size Selection:</p>
            <div className="flex gap-3">
              {SIZES.map(s => (
                <button 
                  key={s} 
                  onClick={() => setSelectedSize(s)}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 font-black transition-all ${selectedSize === s ? 'border-[#FF00FF] text-[#FF00FF] shadow-[0_0_20px_rgba(255,0,255,0.2)]' : 'border-white/10 text-zinc-600'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <a 
            href={`${CONTACT_LINKS.whatsapp}&text=ORDER: ${selectedProduct.name} | SIZE: ${selectedSize}`}
            className="w-full bg-white text-black py-6 rounded-full text-xs font-[1000] uppercase tracking-[0.4em] text-center hover:bg-cyan-400 transition-colors shadow-2xl shadow-cyan-400/10"
          >
            Confirm Limited Preorder
          </a>
        </div>
      </div>

      {/* AI MODAL */}
      {isTryOnOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6">
          <button onClick={() => setIsTryOnOpen(false)} className="absolute top-10 right-10 text-zinc-500 hover:text-white uppercase text-[10px] font-black tracking-widest border border-white/10 px-6 py-2 rounded-full">✕ Exit Studio</button>
          <div className="w-full max-w-lg">
             <TryOnEngine itemUrl={selectedProduct.image} />
          </div>
        </div>
      )}
    </main>
  )
}
