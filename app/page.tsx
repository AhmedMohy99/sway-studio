'use client'

import { useState, useEffect } from 'react'
// Fixed imports: Added SIZES constant and used 'type' for TypeScript definitions
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

type Section = 'try-test' | 'preorder'

export default function Home() {
  const [activeSection, setActiveSection] = useState<Section>('try-test')

  // Try-on modal state
  const [tryOnOpen, setTryOnOpen] = useState(false)
  const [tryOnProduct, setTryOnProduct] = useState<Product | null>(null)
  const [tryOnImage, setTryOnImage] = useState('')
  const [tryOnSize, setTryOnSize] = useState<SizeOption>('L')

  // Pre-order state
  const [preorderVariant, setPreorderVariant] = useState(
    PREORDER_PRODUCT.variants![0]
  )
  const [preorderSize, setPreorderSize] = useState<SizeOption>('L')

  // Size guide
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)

  // Lock body scroll when Try-On Studio is open to prevent background movement
  useEffect(() => {
    if (tryOnOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [tryOnOpen])

  const openTryOn = (prod: Product) => {
    setTryOnProduct(prod)
    setTryOnImage(prod.tryOnImage || prod.image)
    setTryOnSize('L')
    setTryOnOpen(true)
  }

  const closeTryOn = () => {
    setTryOnOpen(false)
    setTryOnProduct(null)
  }

  const sendPreorder = () => {
    const msg = `Hello, I want to preorder *${PREORDER_PRODUCT.name}*.
Color: ${preorderVariant.colorName}
Size: ${preorderSize}

Please confirm availability.`
    
    const encodedMsg = encodeURIComponent(msg)
    window.open(`${CONTACT_LINKS.whatsapp}&text=${encodedMsg}`, '_blank')
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white selection:bg-cyan-400 selection:text-black">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#080808]/90 backdrop-blur-2xl border-b border-white/5 flex items-center justify-between px-6 md:px-12 py-5">
        <div className="cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <h1 className="text-xl font-black italic tracking-tighter text-cyan-400 uppercase leading-none">
            SWAY STUDIO
          </h1>
          <span className="text-[7px] tracking-[0.5em] text-zinc-600 font-bold uppercase block mt-1">
            AERO Collection
          </span>
        </div>

        <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          <button
            onClick={() => setActiveSection('try-test')}
            className={`transition-colors ${activeSection === 'try-test' ? 'text-white' : 'hover:text-zinc-300'}`}
          >
            Try & Test
          </button>
          <button
            onClick={() => setActiveSection('preorder')}
            className={`transition-colors ${activeSection === 'preorder' ? 'text-white' : 'hover:text-zinc-300'}`}
          >
            Pre-Order
          </button>
          <button
            onClick={() => setSizeGuideOpen(true)}
            className="hover:text-cyan-400 transition-colors"
          >
            Size Guide
          </button>
        </div>

        <a
          href={CONTACT_LINKS.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] uppercase font-black tracking-widest bg-cyan-400 text-black px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:bg-cyan-300 transition-all active:scale-95"
        >
          WhatsApp
        </a>
      </nav>

      {/* ── SECTION TABS ── */}
      <div className="pt-28 px-6 flex justify-center gap-3 pb-6 sticky top-0 bg-[#080808]/80 backdrop-blur-md z-40 border-b border-white/5">
        {(['try-test', 'preorder'] as Section[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSection(tab)}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all border-2 ${
              activeSection === tab
                ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/25'
                : 'border-white/10 text-zinc-600 hover:border-white/25 hover:text-zinc-400'
            }`}
          >
            {tab === 'try-test' ? 'Try & Test' : 'Pre Order'}
          </button>
        ))}
      </div>

      {/* ── TRY & TEST SECTION ── */}
      {activeSection === 'try-test' && (
        <section className="px-6 md:px-16 pt-12 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="text-center mb-16">
            <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase text-white leading-none mb-4">
              AERO <span className="text-zinc-800">COLLECT</span>
            </h2>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.5em] font-bold">
              Real-time AI Simulation Studio
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {TRY_TEST_PRODUCTS.map((prod, idx) => (
              <div key={prod.name + idx} className="group flex flex-col items-center">
                <div className="relative w-full aspect-[3/4] rounded-[40px] overflow-hidden bg-zinc-900 border border-white/5 shadow-2xl mb-6">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <button
                    onClick={() => openTryOn(prod)}
                    className="absolute bottom-6 left-6 right-6 bg-white text-black py-4 rounded-full text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-2xl hover:bg-cyan-400 active:scale-95"
                  >
                    Launch AI Studio
                  </button>
                </div>
                <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-400 mb-2">{prod.name}</h3>
                <span className="text-2xl font-black text-white italic">{prod.price} <span className="text-[10px] not-italic text-zinc-500 uppercase">EGP</span></span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── PRE-ORDER SECTION ── */}
      {activeSection === 'preorder' && (
        <section className="px-6 md:px-16 pt-12 pb-32 max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <header className="text-center mb-16">
            <h2 className="text-5xl md:text-8xl font-black italic tracking-tighter uppercase text-white leading-none mb-4">
              ETERNITY <span className="text-cyan-500">PROTOCOL</span>
            </h2>
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.5em] font-bold">Secure your unit · Global Shipping</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
            {PREORDER_PRODUCT.variants?.map((v) => (
              <button
                key={v.colorName}
                onClick={() => setPreorderVariant(v)}
                className={`group relative aspect-[3/4] rounded-[48px] overflow-hidden border-2 transition-all duration-500 ${
                  preorderVariant.colorName === v.colorName ? 'border-cyan-400 shadow-[0_0_40px_rgba(34,211,238,0.15)]' : 'border-white/5 hover:border-white/20'
                }`}
              >
                <img src={v.url} alt={v.colorName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
                <div className="absolute bottom-8 left-8 right-8 flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-white">{v.colorName}</span>
                  {preorderVariant.colorName === v.colorName && <div className="px-3 py-1 bg-cyan-400 rounded-full text-[8px] font-black text-black uppercase">Selected</div>}
                </div>
              </button>
            ))}
          </div>

          <div className="bg-zinc-950 border border-white/5 rounded-[40px] p-8 md:p-12 shadow-2xl">
             <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
                <div className="text-center md:text-left">
                  <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Price Point</p>
                  <span className="text-4xl font-black text-white italic">{PREORDER_PRODUCT.price} <span className="text-xs not-italic text-zinc-500">EGP</span></span>
                </div>
                <div className="w-full md:w-auto">
                  <div className="flex items-center justify-between mb-4 px-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Size Selection</p>
                    <button onClick={() => setSizeGuideOpen(true)} className="text-[9px] font-black text-cyan-400 uppercase tracking-widest hover:text-white transition">Chart →</button>
                  </div>
                  <div className="flex gap-2">
                    {SIZES.map((s) => (
                      <button
                        key={s}
                        onClick={() => setPreorderSize(s)}
                        className={`w-14 h-14 border-2 rounded-2xl font-black text-xs transition-all ${preorderSize === s ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5 shadow-[0_0_15px_rgba(34,211,238,0.2)]' : 'border-white/10 text-zinc-600 hover:border-white/30 hover:text-zinc-400'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
             </div>
            <button onClick={sendPreorder} className="w-full bg-[#25D366] text-white py-6 rounded-full text-[11px] font-black uppercase tracking-[0.5em] shadow-2xl shadow-[#25D366]/20 hover:bg-[#1fbd58] transition-all hover:scale-[0.99] active:scale-95 flex items-center justify-center gap-4">
              Reserve via WhatsApp
            </button>
          </div>
        </section>
      )}

      {/* ── TRY-ON MODAL ── */}
      {tryOnOpen && tryOnProduct && (
        <div className="fixed inset-0 z-[100] bg-[#080808] overflow-y-auto">
          <div className="min-h-screen flex flex-col items-center px-6 py-12">
            <div className="w-full max-w-xl flex items-center justify-between mb-12">
              <div>
                <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none mb-1">{tryOnProduct.name}</h2>
                <p className="text-cyan-400 font-bold text-sm tracking-widest uppercase">AI Fitting Studio</p>
              </div>
              <button onClick={closeTryOn} className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 transition-all active:scale-90">✕</button>
            </div>

            <div className="w-full max-w-xl">
              <div className="mb-8 rounded-[40px] overflow-hidden shadow-2xl shadow-cyan-400/5 border border-white/5 bg-zinc-900">
                <TryOnEngine itemUrl={tryOnImage} selectedSize={tryOnSize} productName={tryOnProduct.name} />
              </div>

              <div className="bg-zinc-950/50 border border-white/5 rounded-3xl p-6 mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Simulate Size</p>
                  <button onClick={() => setSizeGuideOpen(true)} className="text-[9px] font-black text-cyan-400 uppercase tracking-widest">Guide</button>
                </div>
                <div className="flex justify-center gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTryOnSize(s)}
                      className={`w-12 h-12 border-2 rounded-xl font-black text-[11px] transition-all ${tryOnSize === s ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-white/5 text-zinc-700 hover:border-white/20'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <a
                href={`${CONTACT_LINKS.whatsapp}&text=${encodeURIComponent(`Hello, I want to order *${tryOnProduct.name}*.\nSize: ${tryOnSize}`)}`}
                target="_blank"
                rel="noreferrer"
                className="block w-full bg-white text-black py-6 rounded-full text-center text-[11px] font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-cyan-400 transition-all active:scale-95"
              >
                Confirm & Order
              </a>
            </div>
          </div>
        </div>
      )}

      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </main>
  )
}
