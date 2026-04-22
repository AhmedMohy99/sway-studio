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
    <main className="min-h-screen bg-black text-white font-sans selection:bg-cyan-400 selection:text-black">
      
      {/* HEADER EXACTLY AS VIDEO */}
      <div className="flex justify-between items-center px-6 py-6 pt-10">
        <div className="flex flex-col">
          <h1 className="text-3xl font-black italic text-cyan-400 tracking-tighter leading-none">SWAY STUDIO</h1>
          <span className="text-[9px] text-zinc-500 tracking-[0.3em] uppercase mt-1">AI Powered Fitting</span>
        </div>
        <a 
          href={CONTACT_LINKS.whatsapp} 
          className="bg-cyan-400 text-black px-6 py-2.5 rounded-full font-black text-[10px] tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all"
        >
          WHATSAPP
        </a>
      </div>

      {/* TABS EXACTLY AS VIDEO */}
      <div className="flex justify-center gap-4 mt-6">
        <button 
          onClick={() => setActiveSection('try-test')} 
          className={`px-8 py-3 rounded-full font-black text-[10px] tracking-widest transition-all ${
            activeSection === 'try-test' 
              ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
              : 'border border-zinc-800 text-zinc-600'
          }`}
        >
          TRY & TEST
        </button>
        <button 
          onClick={() => setActiveSection('preorder')} 
          className={`px-8 py-3 rounded-full font-black text-[10px] tracking-widest transition-all ${
            activeSection === 'preorder' 
              ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]' 
              : 'border border-zinc-800 text-zinc-600'
          }`}
        >
          PRE ORDER
        </button>
      </div>

      {/* SECTION TITLE */}
      <div className="flex flex-col items-center mt-16 mb-10">
         <h2 className="text-3xl font-black italic uppercase tracking-wide">
           {activeSection === 'try-test' ? 'TRY & TEST' : 'PRE ORDER'}
         </h2>
         <div className="w-16 h-1 bg-cyan-400 mt-2 shadow-[0_0_10px_rgba(34,211,238,0.5)]"></div>
      </div>

      {/* PRODUCT GRID */}
      <div className="px-6 flex flex-col gap-16 max-w-md mx-auto pb-32">
        {(activeSection === 'try-test' ? TRY_TEST_PRODUCTS : [PREORDER_PRODUCT]).map((prod) => (
          <div key={prod.name} className="flex flex-col items-center">
            
            {/* PRODUCT CARD WITH OVERLAY BUTTON */}
            <div className="w-full bg-white rounded-[40px] overflow-hidden relative shadow-2xl">
              <img src={prod.image} alt={prod.name} className="w-full object-cover aspect-[4/5]" />
              <div className="absolute bottom-5 left-5 right-5">
                <button 
                  onClick={() => openTryOn(prod)} 
                  className="w-full bg-white text-black py-4 rounded-[20px] font-black text-[11px] tracking-[0.2em] uppercase shadow-xl hover:bg-zinc-100 transition-colors"
                >
                  LAUNCH AI STUDIO
                </button>
              </div>
            </div>

            {/* PRODUCT TEXT */}
            <h3 className="mt-6 text-[12px] font-bold text-white tracking-[0.15em] uppercase text-center">
              {prod.name}
            </h3>
            <p className="text-cyan-400 font-black text-xl mt-1 tracking-wider">
              EGP {prod.price}
            </p>
          </div>
        ))}
      </div>

      {/* AI MODAL (Kept intact with the camera/upload logic) */}
      {tryOnOpen && tryOnProduct && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center p-6 overflow-y-auto">
          <div className="w-full max-w-md flex justify-between items-center mb-6 pt-4">
            <h2 className="text-xl font-black italic uppercase text-cyan-400 tracking-tighter">{tryOnProduct.name}</h2>
            <button onClick={() => setTryOnOpen(false)} className="text-zinc-500 hover:text-white text-2xl font-light">✕</button>
          </div>

          <div className="flex gap-3 mb-6 w-full max-w-md bg-zinc-900 p-1.5 rounded-full border border-zinc-800">
            <button onClick={() => setMode('camera')} className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase transition-all ${mode === 'camera' ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-zinc-500'}`}>Live Camera</button>
            <label className={`flex-1 py-3 text-center rounded-full text-[10px] font-black uppercase cursor-pointer transition-all ${mode === 'upload' ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]' : 'text-zinc-500'}`}>
              Upload Photo
              <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
            </label>
          </div>

          <div className="w-full max-w-md aspect-[3/4] rounded-[40px] overflow-hidden bg-zinc-900 border border-zinc-800 relative shadow-2xl">
            {mode === 'camera' ? (
              <TryOnEngine itemUrl={tryOnImage} selectedSize={tryOnSize} />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center bg-zinc-950">
                {userImg ? (
                  <>
                    <img src={userImg} className="w-full h-full object-cover" />
                    <img src={tryOnImage} className="absolute inset-0 w-full h-full object-contain p-12 drop-shadow-2xl" />
                  </>
                ) : (
                  <p className="text-zinc-600 text-[10px] uppercase font-black tracking-widest">Select a photo from gallery</p>
                )}
              </div>
            )}
          </div>

          {tryOnProduct.variants && (
            <div className="mt-6 flex gap-3 w-full max-w-md">
              {tryOnProduct.variants.map(v => (
                <button 
                  key={v.colorName} 
                  onClick={() => setTryOnImage(v.tryOnImage)}
                  className={`flex-1 py-3 rounded-full text-[10px] font-black uppercase border-2 transition-all ${tryOnImage === v.tryOnImage ? 'border-cyan-400 text-cyan-400' : 'border-zinc-800 text-zinc-600'}`}
                >
                  {v.colorName}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 flex gap-2 w-full max-w-md justify-between">
            {SIZES.map(s => (
              <button key={s} onClick={() => setTryOnSize(s)} className={`w-14 h-14 rounded-2xl font-black text-sm transition-all ${tryOnSize === s ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.4)]' : 'bg-zinc-900 text-zinc-600 border border-zinc-800 hover:text-white'}`}>{s}</button>
            ))}
          </div>

          <button 
            onClick={() => window.open(`${CONTACT_LINKS.whatsapp}&text=Order: ${tryOnProduct.name} Size: ${tryOnSize}`)} 
            className="mt-8 mb-10 w-full max-w-md bg-white text-black py-5 rounded-[20px] font-black uppercase text-[11px] tracking-widest shadow-2xl hover:bg-cyan-400 transition-colors"
          >
            Confirm Order via WhatsApp
          </button>
        </div>
      )}
    </main>
  )
}
