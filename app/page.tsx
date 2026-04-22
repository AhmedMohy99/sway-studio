'use client'

import { useState, useEffect, useRef } from 'react'
import {
  TRY_TEST_PRODUCTS,
  PREORDER_PRODUCT,
  CONTACT_LINKS,
  SIZES, 
  type Product,
  type SizeOption,
} from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'
import SizeGuide from '@/components/SizeGuide'

export default function Home() {
  const [activeSection, setActiveSection] = useState<'try-test' | 'preorder'>('try-test')
  const [tryOnOpen, setTryOnOpen] = useState(false)
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null)
  const [tryOnImage, setTryOnImage] = useState('')
  const [tryOnSize, setTryOnSize] = useState<SizeOption>('L')
  const [mode, setMode] = useState<'camera' | 'upload'>('camera')
  const [userUploadedImg, setUserUploadedImg] = useState<string | null>(null)
  
  const [preorderVariant, setPreorderVariant] = useState(PREORDER_PRODUCT.variants![0])
  const [preorderSize, setPreorderSize] = useState<SizeOption>('L')
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = tryOnOpen ? 'hidden' : 'unset'
  }, [tryOnOpen])

  const openTryOn = (prod: Product) => {
    setTryOnProduct(prod);
    // Handle variants (like Phoenix) or single images
    const initialImg = prod.variants ? prod.variants[0].tryOnImage : prod.tryOnImage;
    setTryOnImage(initialImg || prod.image);
    setTryOnOpen(true);
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setUserUploadedImg(url);
      setMode('upload');
    }
  }

  const sendOrder = (prodName: string, size: string) => {
    const msg = `Hello, I want to order *${prodName}*.\nSize: ${size}`;
    window.open(`${CONTACT_LINKS.whatsapp}&text=${encodeURIComponent(msg)}`, '_blank');
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white font-sans">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 py-5">
        <h1 className="text-xl font-black italic tracking-tighter text-cyan-400 uppercase">SWAY STUDIO</h1>
        <div className="flex gap-4">
           <button onClick={() => setSizeGuideOpen(true)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Size Guide</button>
           <a href={CONTACT_LINKS.whatsapp} className="bg-cyan-400 text-black px-4 py-2 rounded-full text-[10px] font-black uppercase">WhatsApp</a>
        </div>
      </nav>

      {/* SECTION TABS */}
      <div className="pt-24 flex justify-center gap-4 mb-10">
        <button onClick={() => setActiveSection('try-test')} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase border ${activeSection === 'try-test' ? 'bg-white text-black' : 'border-white/10 text-zinc-500'}`}>Try & Test</button>
        <button onClick={() => setActiveSection('preorder')} className={`px-6 py-2 rounded-full text-[10px] font-bold uppercase border ${activeSection === 'preorder' ? 'bg-white text-black' : 'border-white/10 text-zinc-500'}`}>Pre-Order</button>
      </div>

      {/* TRY ON GRID */}
      {activeSection === 'try-test' && (
        <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-8 pb-20">
          {TRY_TEST_PRODUCTS.map((prod) => (
            <div key={prod.name} className="group">
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden bg-zinc-900 border border-white/5">
                <img src={prod.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <button onClick={() => openTryOn(prod)} className="absolute inset-x-4 bottom-4 bg-white text-black py-3 rounded-2xl text-[10px] font-black uppercase shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">Launch AI Studio</button>
              </div>
              <p className="mt-3 text-[11px] font-bold text-zinc-400 uppercase tracking-widest text-center">{prod.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* AI MODAL */}
      {tryOnOpen && tryOnProduct && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center p-6 overflow-y-auto">
          <div className="w-full max-w-md flex justify-between mb-6">
            <h2 className="text-xl font-black italic uppercase text-white">{tryOnProduct.name}</h2>
            <button onClick={() => setTryOnOpen(false)} className="text-zinc-500 text-2xl">✕</button>
          </div>

          {/* MODE SWITCHER */}
          <div className="flex gap-2 mb-6">
            <button onClick={() => setMode('camera')} className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase ${mode === 'camera' ? 'bg-cyan-400 text-black' : 'bg-zinc-800 text-zinc-500'}`}>Live Camera</button>
            <label className={`px-4 py-2 rounded-xl text-[9px] font-bold uppercase cursor-pointer ${mode === 'upload' ? 'bg-cyan-400 text-black' : 'bg-zinc-800 text-zinc-500'}`}>
              Upload Photo
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>

          {/* ENGINE */}
          <div className="w-full max-w-md aspect-[3/4] rounded-[40px] overflow-hidden bg-zinc-900 border border-white/10 relative">
            {mode === 'camera' ? (
              <TryOnEngine itemUrl={tryOnImage} selectedSize={tryOnSize} />
            ) : (
              <div className="relative w-full h-full">
                {userUploadedImg && <img src={userUploadedImg} className="w-full h-full object-cover" />}
                <img src={tryOnImage} className="absolute inset-0 w-full h-full object-contain pointer-events-none p-10 opacity-80" />
              </div>
            )}
          </div>

          {/* VARIANT SELECTOR (for Phoenix) */}
          {tryOnProduct.variants && (
            <div className="mt-6 flex gap-2">
              {tryOnProduct.variants.map(v => (
                <button 
                  key={v.colorName} 
                  onClick={() => setTryOnImage(v.tryOnImage!)}
                  className={`px-4 py-2 rounded-lg text-[9px] font-bold border ${tryOnImage === v.tryOnImage ? 'border-cyan-400 text-cyan-400' : 'border-white/10 text-zinc-500'}`}
                >
                  {v.colorName}
                </button>
              ))}
            </div>
          )}

          {/* SIZE SELECTOR */}
          <div className="mt-6 flex gap-2">
            {SIZES.map(s => (
              <button key={s} onClick={() => setTryOnSize(s)} className={`w-10 h-10 rounded-lg text-xs font-bold ${tryOnSize === s ? 'bg-cyan-400 text-black' : 'bg-zinc-800'}`}>{s}</button>
            ))}
          </div>

          <button onClick={() => sendOrder(tryOnProduct.name, tryOnSize)} className="mt-8 w-full max-w-md bg-white text-black py-4 rounded-full font-black uppercase text-xs">Confirm & Order</button>
        </div>
      )}

      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </main>
  )
}
