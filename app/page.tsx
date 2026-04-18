'use client'
import { useState } from 'react'
import { COLLECTIONS, CONTACT_LINKS } from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'

export default function Home() {
  const [activeTab, setActiveTab] = useState(COLLECTIONS[0].id)
  const [selectedProduct, setSelectedProduct] = useState(COLLECTIONS[0].products[0])
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)

  return (
    <main className="bg-black text-white min-h-screen font-sans">
      {/* 1. STICKY NAV */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-lg border-b border-white/5 p-6 flex justify-between items-center">
        <h1 className="text-2xl font-black italic tracking-tighter text-cyan-400">SWAY</h1>
        <div className="flex gap-4">
          <a href={CONTACT_LINKS.instagram} target="_blank" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white">IG</a>
          <a href={CONTACT_LINKS.whatsapp} target="_blank" className="text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white">WA</a>
        </div>
      </nav>

      {/* 2. COLLECTION SELECTOR */}
      <section className="pt-32 px-6">
        <div className="flex gap-8 overflow-x-auto pb-4 no-scrollbar border-b border-white/5">
          {COLLECTIONS.map(col => (
            <button 
              key={col.id}
              onClick={() => setActiveTab(col.id)}
              className={`text-xs uppercase tracking-[0.3em] whitespace-nowrap ${activeTab === col.id ? 'text-cyan-400 font-bold' : 'text-zinc-600'}`}
            >
              {col.name}
            </button>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT GRID */}
      <section className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {COLLECTIONS.find(c => c.id === activeTab)?.products.map((prod, idx) => (
          <div key={idx} className="group bg-zinc-950 border border-white/5 rounded-[32px] overflow-hidden hover:border-cyan-400/50 transition-all">
            <div className="aspect-[4/5] relative overflow-hidden">
              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <button 
                onClick={() => { setSelectedProduct(prod); setIsTryOnOpen(true); }}
                className="absolute bottom-4 left-4 right-4 bg-white text-black py-3 rounded-full text-[10px] font-bold uppercase tracking-widest translate-y-12 group-hover:translate-y-0 transition-transform"
              >
                AI Try-On
              </button>
            </div>
            <div className="p-6">
              <h3 className="text-sm font-medium uppercase tracking-tighter mb-1">{prod.name}</h3>
              <div className="flex gap-3 items-center">
                <span className="text-cyan-400 font-bold">EGP {prod.price}</span>
                {prod.oldPrice && <span className="text-zinc-600 line-through text-xs">EGP {prod.oldPrice}</span>}
              </div>
              
              {/* PREORDER BUTTON (WHATSAPP INTEGRATION) */}
              <a 
                href={`${CONTACT_LINKS.whatsapp}&text=I want to preorder the ${prod.name}`}
                className="mt-6 block w-full border border-white/10 text-center py-4 rounded-full text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition"
              >
                Limited Drop Preorder
              </a>
            </div>
          </div>
        ))}
      </section>

      {/* 4. AI TRY-ON MODAL */}
      {isTryOnOpen && (
        <div className="fixed inset-0 z-[100] bg-black p-6 flex flex-col">
          <button onClick={() => setIsTryOnOpen(false)} className="self-end mb-4 text-zinc-500 uppercase text-[10px] tracking-widest">Close ✕</button>
          <div className="flex-1 flex flex-col items-center justify-center">
            <h2 className="text-xs uppercase tracking-[0.4em] text-cyan-400 mb-6">Fitting: {selectedProduct.name}</h2>
            <TryOnEngine itemUrl={selectedProduct.image} />
          </div>
        </div>
      )}
    </main>
  )
}
