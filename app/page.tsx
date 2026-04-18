'use client'
import { useState, useEffect } from 'react'
import { COLLECTIONS, CONTACT_LINKS } from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'

export default function Home() {
  const [activeTab, setActiveTab] = useState(COLLECTIONS[0].id)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [activeImage, setActiveImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('L')
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)

  // Switch content when collection changes
  useEffect(() => {
    const col = COLLECTIONS.find(c => c.id === activeTab)
    if (col && col.products.length > 0) {
      setSelectedProduct(col.products[0])
      setActiveImage(col.products[0].image)
    }
  }, [activeTab])

  if (!selectedProduct) return null

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      {/* 1. HEADER */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/5 p-8 flex justify-between items-center px-12">
        <h1 className="text-2xl font-[1000] italic tracking-tighter text-cyan-400">SWAY STUDIO</h1>
        <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          <span className="text-white">Shop</span>
          <span>Story</span>
          <span>Sizing</span>
        </div>
      </nav>

      {/* 2. COLLECTION NAVIGATION */}
      <div className="pt-28 px-12 pb-6 flex gap-4 overflow-x-auto no-scrollbar sticky top-0 bg-black z-40 border-b border-white/5">
        {COLLECTIONS.map(col => (
          <button 
            key={col.id}
            onClick={() => setActiveTab(col.id)}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
              activeTab === col.id ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/30' : 'border-white/10 text-zinc-600 hover:border-white/30'
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 min-h-[80vh]">
        {/* LEFT: IMAGE */}
        <div className="p-12 border-r border-white/5 flex flex-col items-center justify-center relative group">
          <div className="aspect-[3/4] w-full max-w-lg rounded-[40px] overflow-hidden bg-zinc-950 border border-white/10 relative">
            <img src={activeImage} className="w-full h-full object-cover" alt="product view" />
            <button onClick={() => setIsTryOnOpen(true)} className="absolute bottom-10 left-10 right-10 bg-cyan-400 text-black py-5 rounded-full text-[11px] font-[1000] uppercase tracking-[0.4em] shadow-xl">
              Virtual Fitting Engine
            </button>
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="p-20 flex flex-col justify-center">
          <div className="mb-10">
            <h2 className="text-6xl font-[1000] italic tracking-tighter uppercase mb-2 leading-none">{selectedProduct.name}</h2>
            <p className="text-[10px] font-black tracking-widest text-zinc-700 uppercase mb-8">SKU: {selectedProduct.sku || 'SWAY-OTOW-GEN'}</p>
            <p className="font-[1000] text-4xl italic text-white">EGP {selectedProduct.price}.00</p>
          </div>

          {/* ITEM SELECTOR (If collection has multiple items like Urban Fossils) */}
          <div className="mb-10">
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-4">Select Item:</p>
            <div className="flex gap-4">
              {COLLECTIONS.find(c => c.id === activeTab)?.products.map((p: any, i: number) => (
                <button 
                    key={i} 
                    onClick={() => { setSelectedProduct(p); setActiveImage(p.image); }}
                    className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all ${selectedProduct.name === p.name ? 'border-cyan-400' : 'border-white/5 opacity-40 hover:opacity-100'}`}
                >
                  <img src={p.image} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* COLOR SELECTOR (Only for AERO/Variants) */}
          {selectedProduct.variants && (
            <div className="mb-10">
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-4">Variant Selection:</p>
              <div className="flex gap-3">
                {selectedProduct.variants.map((v: any) => (
                  <button 
                    key={v.colorName} 
                    onClick={() => setActiveImage(v.url)}
                    className={`px-6 py-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${activeImage === v.url ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5' : 'border-white/10 text-zinc-600'}`}
                  >
                    {v.colorName}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR */}
          <div className="mb-12">
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-4">Size Selection:</p>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL', '2XL'].map((s) => (
                <button key={s} onClick={() => setSelectedSize(s)} className={`w-14 h-14 flex items-center justify-center border-2 rounded-xl text-sm font-black transition-all ${selectedSize === s ? 'border-[#FF00FF] text-[#FF00FF] shadow-[0_0_15px_rgba(255,0,255,0.2)]' : 'border-white/10 text-zinc-600'}`}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <a href={`${CONTACT_LINKS.whatsapp}&text=ORDER: ${selectedProduct.name} | SIZE: ${selectedSize}`} className="w-full bg-white text-black text-center py-6 rounded-full text-xs font-[1000] uppercase tracking-[0.4em] hover:bg-cyan-400 transition-colors shadow-2xl">
            Confirm Limited Preorder
          </a>
        </div>
      </div>

      {/* MODAL */}
      {isTryOnOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6">
          <button onClick={() => setIsTryOnOpen(false)} className="absolute top-10 right-10 text-zinc-500 uppercase text-[10px] font-black tracking-widest border border-white/10 px-6 py-2 rounded-full">✕ Close</button>
          <div className="w-full max-w-lg">
            <TryOnEngine itemUrl={activeImage} />
          </div>
        </div>
      )}
    </main>
  )
}
