'use client'

import { useState, useEffect } from 'react'
import {
  TRY_TEST_PRODUCTS,
  PREORDER_PRODUCT,
  CONTACT_LINKS,
  SIZES,
  type Product,
  type SizeOption
} from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'

export default function Home() {
  const [activeSection, setActiveSection] = useState<'try-test' | 'preorder'>('try-test')
  const [tryOnOpen, setTryOnOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState<SizeOption>('L')

  useEffect(() => {
    document.body.style.overflow = tryOnOpen ? 'hidden' : 'unset'
  }, [tryOnOpen])

  const openTryOn = (prod: Product) => {
    setActiveProduct(prod)
    // Start with the first variant if available, or the default image
    setSelectedImage(prod.variants ? prod.variants[0].tryOnImage : (prod.tryOnImage || prod.image))
    setTryOnOpen(true)
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-cyan-400 selection:text-black">
      
      {/* HEADER */}
      <nav className="flex items-center justify-between px-8 py-8 border-b border-white/5">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black italic text-cyan-400 uppercase tracking-tighter leading-none">SWAY STUDIO</h1>
          <span className="text-[9px] text-zinc-500 tracking-[0.3em] uppercase mt-1">AI Powered Fitting</span>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveSection('try-test')} 
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${activeSection === 'try-test' ? 'bg-cyan-400 text-black' : 'border border-zinc-800 text-zinc-600'}`}
          >
            TRY & TEST
          </button>
          <button 
            onClick={() => setActiveSection('preorder')} 
            className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${activeSection === 'preorder' ? 'bg-cyan-400 text-black' : 'border border-zinc-800 text-zinc-600'}`}
          >
            PRE ORDER
          </button>
        </div>
      </nav>

      {/* HERO SECTION TITLE */}
      <div className="py-16 text-center">
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
          {activeSection === 'try-test' ? 'AERO' : 'NEXT'} <span className="text-zinc-900 drop-shadow-[0_0_1px_rgba(255,255,255,0.2)]">Collection</span>
        </h2>
      </div>

      {/* PRODUCT GRID */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto pb-40">
        {(activeSection === 'try-test' ? TRY_TEST_PRODUCTS : [PREORDER_PRODUCT]).map((prod) => (
          <div key={prod.name} className="flex flex-col items-center group">
            <div className="relative w-full aspect-[3/4] bg-zinc-950 rounded-3xl overflow-hidden mb-6 shadow-2xl border border-white/5">
              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <button 
                onClick={() => openTryOn(prod)}
                className="absolute inset-x-8 bottom-8 bg-white text-black py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl"
              >
                Launch AI Studio
              </button>
            </div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">{prod.name}</h3>
            <div className="flex gap-3 items-center">
              <p className="text-[11px] font-black text-cyan-400 uppercase">EGP {prod.price}</p>
              {prod.oldPrice && <p className="text-[10px] text-zinc-600 line-through">EGP {prod.oldPrice}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* AI STUDIO MODAL */}
      {tryOnOpen && activeProduct && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center p-6 overflow-y-auto">
          <div className="w-full max-w-xl flex justify-between items-center mb-8 pt-6">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-cyan-400">{activeProduct.name}</h2>
            <button onClick={() => setTryOnOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-500">✕</button>
          </div>

          <div className="w-full max-w-md aspect-[3/4] bg-zinc-950 rounded-[40px] overflow-hidden border border-white/10 relative shadow-2xl">
             <TryOnEngine itemUrl={selectedImage} selectedSize={selectedSize} />
          </div>

          {/* COLOR PICKER (FOR PHOENIX & ETERNITY) */}
          {activeProduct.variants && (
            <div className="mt-8 flex gap-3 bg-zinc-900 p-1.5 rounded-full border border-white/5">
              {activeProduct.variants.map(v => (
                <button 
                  key={v.colorName} 
                  onClick={() => setSelectedImage(v.tryOnImage)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase transition-all ${selectedImage === v.tryOnImage ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'text-zinc-600'}`}
                >
                  {v.colorName}
                </button>
              ))}
            </div>
          )}

          {/* SIZE PICKER */}
          <div className="mt-8 flex gap-2">
            {(activeProduct.type === 'regular' ? SIZES : SIZES.slice(0, 4)).map(s => (
              <button 
                key={s} 
                onClick={() => setSelectedSize(s)} 
                className={`w-12 h-12 rounded-xl font-black text-sm transition-all border-2 ${selectedSize === s ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'bg-zinc-950 border-white/5 text-zinc-600'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <button 
             onClick={() => window.open(`${CONTACT_LINKS.whatsapp}&text=I want to order ${activeProduct.name} | Color: ${activeProduct.variants?.find(v => v.tryOnImage === selectedImage)?.colorName || 'Default'} | Size: ${selectedSize}`)}
             className="mt-10 w-full max-w-md bg-white text-black py-6 rounded-full font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-cyan-400 transition-all active:scale-95 mb-10"
          >
            Confirm Order
          </button>
        </div>
      )}
    </main>
  )
}
