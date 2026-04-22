'use client'

import { useState, useEffect } from 'react'
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
  
  // NEW: Mode state for Upload vs Camera
  const [mode, setMode] = useState<'camera' | 'upload'>('camera')
  const [userImg, setUserImg] = useState<string | null>(null)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = tryOnOpen ? 'hidden' : 'unset'
  }, [tryOnOpen])

  const openTryOn = (prod: Product) => {
    setTryOnProduct(prod)
    // If it has variants (Phoenix), use the first one, otherwise use tryOnImage
    setTryOnImage(prod.variants ? prod.variants[0].tryOnImage : (prod.tryOnImage || prod.image))
    setTryOnOpen(true)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUserImg(URL.createObjectURL(file))
      setMode('upload')
    }
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 py-5">
        <h1 className="text-xl font-black italic text-cyan-400 uppercase">SWAY STUDIO</h1>
        <button onClick={() => setSizeGuideOpen(true)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Size Guide</button>
      </nav>

      {/* SECTION TABS */}
      <div className="pt-24 flex justify-center gap-4 mb-10">
        <button onClick={() => setActiveSection('try-test')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${activeSection === 'try-test' ? 'bg-cyan-400 border-cyan-400 text-black' : 'border-white/10 text-zinc-600'}`}>Try-On</button>
        <button onClick={() => setActiveSection('preorder')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${activeSection === 'preorder' ? 'bg-cyan-400 border-cyan-400 text-black' : 'border-white/10 text-zinc-600'}`}>Pre-Order</button>
      </div>

      {/* PRODUCTS */}
      {activeSection === 'try-test' && (
        <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-7xl mx-auto pb-20">
          {TRY_TEST_PRODUCTS.map((prod) => (
            <div key={prod.name} className="group">
              <div className="relative aspect-[3/4] rounded-[40px] overflow-hidden bg-zinc-900 border border-white/5">
                <img src={prod.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <button onClick={() => openTryOn(prod)} className="absolute inset-x-6 bottom-6 bg-white text-black py-4 rounded-full text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl">Launch AI Studio</button>
              </div>
              <h3 className="mt-4 text-[11px] font-black text-center uppercase tracking-widest text-zinc-400">{prod.name}</h3>
            </div>
          ))}
        </div>
      )}

      {/* AI MODAL */}
      {tryOnOpen && tryOnProduct && (
        <div className="fixed inset-0 z-[100] bg-[#080808] flex flex-col items-center p-6 overflow-y-auto">
          <div className="w-full max-w-xl flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic uppercase text-white">{tryOnProduct.name}</h2>
            <button onClick={() => setTryOnOpen(false)} className="text-zinc-500 hover:text-white text-2xl">✕</button>
          </div>

          {/* MODE SELECTOR */}
          <div className="flex gap-3 mb-8 bg-zinc-950 p-1.5 rounded-2xl border border-white/5">
            <button onClick={() => setMode('camera')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'camera' ? 'bg-white text-black' : 'text-zinc-500'}`}>Live Camera</button>
            <label className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase cursor-pointer transition-all ${mode === 'upload' ? 'bg-white text-black' : 'text-zinc-500'}`}>
              Upload Photo
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>

          {/* DISPLAY AREA */}
          <div className="w-full max-w-md aspect-[3/4] rounded-[48px] overflow-hidden bg-black border border-white/10 shadow-2xl relative">
            {mode === 'camera' ? (
              <TryOnEngine itemUrl={tryOnImage} selectedSize={tryOnSize} />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center">
                {userImg ? (
                  <>
                    <img src={userImg} className="w-full h-full object-cover" />
                    <img src={tryOnImage} className="absolute inset-0 w-full h-full object-contain p-12 drop-shadow-2xl" />
                  </>
                ) : (
                  <p className="text-zinc-700 text-[10px] uppercase font-bold tracking-widest">Please upload a photo</p>
                )}
              </div>
            )}
          </div>

          {/* COLOR VARIANTS (For Phoenix) */}
          {tryOnProduct.variants && (
            <div className="mt-8 flex gap-3">
              {tryOnProduct.variants.map(v => (
                <button 
                  key={v.colorName} 
                  onClick={() => setTryOnImage(v.tryOnImage)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border-2 transition-all ${tryOnImage === v.tryOnImage ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5' : 'border-white/10 text-zinc-600'}`}
                >
                  {v.colorName}
                </button>
              ))}
            </div>
          )}

          {/* SIZE & ORDER */}
          <div className="mt-8 flex gap-2">
            {SIZES.map(s => (
              <button key={s} onClick={() => setTryOnSize(s)} className={`w-12 h-12 rounded-xl font-black text-sm transition-all ${tryOnSize === s ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'bg-zinc-900 text-zinc-600 border border-white/5'}`}>{s}</button>
            ))}
          </div>

          <button 
            onClick={() => window.open(`${CONTACT_LINKS.whatsapp}&text=Order: ${tryOnProduct.name} Size: ${tryOnSize}`)} 
            className="mt-10 w-full max-w-md bg-white text-black py-6 rounded-full font-black uppercase text-xs shadow-2xl hover:bg-cyan-400 transition-all active:scale-95"
          >
            Confirm Order via WhatsApp
          </button>
        </div>
      )}

      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </main>
  )
}
