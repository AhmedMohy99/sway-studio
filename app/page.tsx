'use client'
import { useState } from 'react'
import { COLLECTIONS, CONTACT_LINKS, MANIFESTO_TEXT } from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'

export default function Home() {
  const [activeTab, setActiveTab] = useState(COLLECTIONS[0].id)
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(COLLECTIONS[0].products[0])

  const currentCollection = COLLECTIONS.find(c => c.id === activeTab)

  return (
    <main className="bg-black text-white min-h-screen selection:bg-cyan-400">
      {/* 1. HEADER */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/5 p-6 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-2xl font-[900] italic tracking-tighter text-cyan-400 leading-none">SWAY STUDIO</h1>
          <span className="text-[7px] tracking-[0.6em] uppercase text-zinc-500 font-bold mt-1">AI-POWERED FITTING</span>
        </div>
        <a href={CONTACT_LINKS.whatsapp} target="_blank" className="text-[10px] uppercase tracking-widest bg-white text-black px-6 py-2.5 rounded-full font-[900] hover:scale-105 transition">Order via WhatsApp</a>
      </nav>

      {/* 2. PILL NAVIGATION */}
      <div className="pt-28 px-6 flex gap-3 overflow-x-auto no-scrollbar border-b border-white/5 sticky top-0 bg-black z-40 pb-6">
        {COLLECTIONS.map(col => (
          <button 
            key={col.id}
            onClick={() => setActiveTab(col.id)}
            className={`px-6 py-3 rounded-full text-[11px] font-[900] uppercase tracking-[0.2em] transition-all duration-300 whitespace-nowrap border-2 ${
              activeTab === col.id 
                ? 'bg-cyan-400 border-cyan-400 text-black shadow-[0_0_20px_rgba(0,245,255,0.3)]' 
                : 'bg-transparent border-white/10 text-zinc-500 hover:border-white/30'
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {/* 3. PRODUCT GRID */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {currentCollection?.products.map((prod: any, idx: number) => (
          <div key={idx} className="bg-zinc-950 border border-white/5 rounded-[40px] p-3 hover:border-cyan-400/40 transition-all group">
            <div className="aspect-[4/5] relative rounded-[32px] overflow-hidden bg-zinc-900">
              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={() => { setSelectedProduct(prod); setIsTryOnOpen(true); }}
                className="absolute bottom-6 left-6 right-6 bg-cyan-400 text-black py-4 rounded-full text-[11px] font-[900] uppercase tracking-widest shadow-2xl shadow-cyan-400/40 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all"
              >
                Virtual Fitting
              </button>
            </div>
            
            <div className="p-6 text-center">
              <h3 className="text-[12px] font-[900] uppercase tracking-tighter text-white mb-1 leading-tight">{prod.name}</h3>
              <p className="text-[9px] text-zinc-600 font-bold mb-2 tracking-widest">{prod.sku || 'SKU: SWAY-GEN-26'}</p>
              <p className="font-[900] text-xl italic text-cyan-400 tracking-tighter mb-4">EGP {prod.price}</p>
              
              {/* SIZE SELECTOR UI */}
              <div className="flex justify-center gap-2 mb-6">
                {['S', 'M', 'L', 'XL', '2XL'].map((size) => (
                  <div key={size} className={`w-8 h-8 flex items-center justify-center border rounded-md text-[10px] font-black transition-all ${size === 'L' ? 'border-magenta-500 text-white border-2 shadow-[0_0_10px_rgba(255,0,255,0.3)]' : 'border-white/10 text-cyan-400'}`}>
                    {size}
                  </div>
                ))}
              </div>

              <a 
                href={`${CONTACT_LINKS.whatsapp}&text=I want to preorder the ${prod.name} in Size L`}
                className="mt-2 inline-block text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition"
              >
                Preorder Drop →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 4. MANIFESTO FOOTER */}
      <footer className="p-20 border-t border-white/5 text-center">
        <p className="text-[10px] uppercase tracking-[0.8em] text-zinc-500 mb-8">The Manifesto</p>
        <h2 className="text-3xl font-[900] italic tracking-tighter max-w-2xl mx-auto leading-tight mb-10">
          "{MANIFESTO_TEXT}"
        </h2>
        <div className="flex justify-center gap-10">
            <a href={CONTACT_LINKS.instagram} target="_blank" className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 hover:text-white">Instagram</a>
            <a href={CONTACT_LINKS.facebook} target="_blank" className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-400 hover:text-white">Facebook</a>
        </div>
      </footer>

      {/* 5. AI MODAL */}
      {isTryOnOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl p-6 flex flex-col items-center overflow-y-auto">
          <button onClick={() => setIsTryOnOpen(false)} className="self-end text-zinc-500 hover:text-white mb-10 tracking-widest text-xs font-black uppercase border border-white/10 px-4 py-2 rounded-full">✕ Close Studio</button>
          <div className="w-full max-w-lg">
            <h2 className="text-cyan-400 text-[11px] font-black uppercase tracking-[0.5em] mb-6 text-center italic">Calibrating: {selectedProduct.name}</h2>
            <TryOnEngine itemUrl={selectedProduct.image} />
          </div>
        </div>
      )}
    </main>
  )
}
