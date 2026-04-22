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
  
  const [mode, setMode] = useState<'camera' | 'upload'>('camera')
  const [userImg, setUserImg] = useState<string | null>(null)
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = tryOnOpen ? 'hidden' : 'unset'
  }, [tryOnOpen])

  const openTryOn = (prod: Product) => {
    setTryOnProduct(prod)
    const initialImg = prod.variants ? prod.variants[0].tryOnImage : (prod.tryOnImage || prod.image)
    setTryOnImage(initialImg)
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
    <main className="min-h-screen bg-[#080808] text-white selection:bg-cyan-400">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 py-5">
        <h1 className="text-xl font-black italic text-cyan-400 uppercase tracking-tighter">SWAY STUDIO</h1>
        <div className="flex gap-6">
          <button onClick={() => setSizeGuideOpen(true)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition">Size Guide</button>
          <a href={CONTACT_LINKS.whatsapp} className="bg-cyan-400 text-black px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-cyan-400/20">WhatsApp</a>
        </div>
      </nav>

      {/* TABS */}
      <div className="pt-24 flex justify-center gap-4 mb-12">
        <button onClick={() => setActiveSection('try-test')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${activeSection === 'try-test' ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'border-white/10 text-zinc-600'}`}>AI Studio</button>
        <button onClick={() => setActiveSection('preorder')} className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest border-2 transition-all ${activeSection === 'preorder' ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'border-white/10 text-zinc-600'}`}>Pre-Order</button>
      </div>

      {/* PRODUCTS */}
      {activeSection === 'try-test' && (
        <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto pb-32">
          {TRY_TEST_PRODUCTS.map((prod) => (
            <div key={prod.name} className="group">
              <div className="relative aspect-[3/4] rounded-[48px] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl">
                <img src={prod.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => openTryOn(prod)} className="bg-white text-black px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest translate-y-4 group-hover:translate-y-0 transition-all">Launch AI Studio</button>
                </div>
              </div>
              <h3 className="mt-6 text-[11px] font-black text-center uppercase tracking-[0.3em] text-zinc-500">{prod.name}</h3>
            </div>
          ))}
        </div>
      )}

      {/* AI MODAL */}
      {tryOnOpen && tryOnProduct && (
        <div className="fixed inset-0 z-[100] bg-[#080808] flex flex-col items-center p-6 overflow-y-auto animate-in fade-in duration-300">
          <div className="w-full max-w-xl flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">{tryOnProduct.name}</h2>
            <button onClick={() => setTryOnOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-zinc-500 hover:text-white transition-all">✕</button>
          </div>

          {/* MODE SWITCH */}
          <div className="flex gap-3 mb-8 bg-zinc-950 p-2 rounded-2xl border border-white/5">
            <button onClick={() => setMode('camera')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${mode === 'camera' ? 'bg-white text-black' : 'text-zinc-600'}`}>Live Camera</button>
            <label className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase cursor-pointer transition-all ${mode === 'upload' ? 'bg-white text-black' : 'text-zinc-600'}`}>
              Upload Photo
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>

          {/* ENGINE */}
          <div className="w-full max-w-md aspect-[3/4] rounded-[56px] overflow-hidden bg-black border border-white/10 shadow-2xl relative">
            {mode === 'camera' ? (
              <TryOnEngine itemUrl={tryOnImage} selectedSize={tryOnSize} />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-zinc-900">
                {userImg ? (
                  <>
                    <img src={userImg} className="w-full h-full object-cover" />
                    <img src={tryOnImage} className="absolute inset-0 w-full h-full object-contain p-16 drop-shadow-2xl animate-pulse" />
                  </>
                ) : (
                  <p className="text-zinc-700 text-[10px] uppercase font-black tracking-widest">Select a photo from your gallery</p>
                )}
              </div>
            )}
          </div>

          {/* COLOR VARIANTS (Phoenix) */}
          {tryOnProduct.variants && (
            <div className="mt-8 flex gap-3">
              {tryOnProduct.variants.map(v => (
                <button 
                  key={v.colorName} 
                  onClick={() => setTryOnImage(v.tryOnImage)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase border-2 transition-all ${tryOnImage === v.tryOnImage ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5' : 'border-white/10 text-zinc-700'}`}
                >
                  {v.colorName}
                </button>
              ))}
            </div>
          )}

          {/* SIZES */}
          <div className="mt-8 flex gap-2">
            {SIZES.map(s => (
              <button key={s} onClick={() => setTryOnSize(s)} className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${tryOnSize === s ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30' : 'bg-zinc-900 text-zinc-700 border border-white/5 hover:text-white'}`}>{s}</button>
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
