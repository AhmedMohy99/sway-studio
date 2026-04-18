'use client'
import { useState } from 'react'
import { COLLECTIONS, CONTACT_LINKS } from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'

export default function Home() {
  const [activeTab, setActiveTab] = useState(COLLECTIONS[0].id)
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(COLLECTIONS[0].products[0])

  const currentCollection = COLLECTIONS.find(c => c.id === activeTab)

  return (
    <main className="bg-black text-white min-h-screen">
      {/* HEADER */}
      <nav className="fixed top-0 w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/5 p-6 flex justify-between items-center">
        <div className="flex flex-col">
          <h1 className="text-xl font-black italic tracking-tighter text-cyan-400">SWAY STUDIO</h1>
          <span className="text-[7px] tracking-[0.4em] uppercase text-zinc-500">2026 Virtual Drop</span>
        </div>
        <div className="flex gap-6">
          <a href={CONTACT_LINKS.whatsapp} target="_blank" className="text-[9px] uppercase tracking-widest bg-white text-black px-4 py-2 rounded-full font-bold">WhatsApp Order</a>
        </div>
      </nav>

      {/* COLLECTION TABS */}
      <div className="pt-28 px-6 flex gap-6 overflow-x-auto no-scrollbar border-b border-white/5">
        {COLLECTIONS.map(col => (
          <button 
            key={col.id}
            onClick={() => setActiveTab(col.id)}
            className={`pb-4 text-[10px] uppercase tracking-[0.3em] transition-all whitespace-nowrap ${activeTab === col.id ? 'text-cyan-400 border-b-2 border-cyan-400' : 'text-zinc-600'}`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {/* PRODUCT GRID */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {currentCollection?.products.map((prod, idx) => (
          <div key={idx} className="bg-zinc-950 border border-white/5 rounded-[40px] p-2 hover:border-cyan-400/30 transition-all group">
            <div className="aspect-[4/5] relative rounded-[35px] overflow-hidden bg-zinc-900">
              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <button 
                onClick={() => { setSelectedProduct(prod); setIsTryOnOpen(true); }}
                className="absolute bottom-6 left-6 right-6 bg-cyan-400 text-black py-4 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-400/20"
              >
                Virtual Fitting
              </button>
            </div>
            <div className="p-6 text-center">
              <h3 className="text-[11px] uppercase tracking-tighter text-zinc-300 mb-2 truncate">{prod.name}</h3>
              <p className="font-bold text-lg italic">EGP {prod.price}</p>
              <a 
                href={`${CONTACT_LINKS.whatsapp}&text=I want to preorder the ${prod.name}`}
                className="mt-4 inline-block text-[9px] uppercase tracking-[0.2em] text-cyan-400 hover:text-white transition"
              >
                Preorder Limited Drop →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* AI MODAL */}
      {isTryOnOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl p-6 flex flex-col items-center">
          <button onClick={() => setIsTryOnOpen(false)} className="self-end text-zinc-500 hover:text-white mb-10 tracking-widest text-xs uppercase">✕ Close Engine</button>
          <h2 className="text-cyan-400 text-[10px] uppercase tracking-[0.5em] mb-4">Calibrating: {selectedProduct.name}</h2>
          <TryOnEngine itemUrl={selectedProduct.image} />
        </div>
      )}
    </main>
  )
}
