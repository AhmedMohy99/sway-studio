'use client'

import { useState } from 'react'
import {
  TRY_TEST_PRODUCTS,
  PREORDER_PRODUCT,
  CONTACT_LINKS,
  Product,
  SizeOption,
} from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'
import SizeGuide from '@/components/SizeGuide'

type Section = 'try-test' | 'preorder'

const SIZES: SizeOption[] = ['S', 'M', 'L', 'XL', '2XL']

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
    const msg = `Hello, I want to preorder *Eternity Protocol*.
Color: ${preorderVariant.colorName}
Size: ${preorderSize}

Please confirm availability.`
    window.open(
      `${CONTACT_LINKS.whatsapp}&text=${encodeURIComponent(msg)}`,
      '_blank'
    )
  }

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 w-full z-50 bg-[#080808]/95 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 md:px-12 py-5">
        <div>
          <h1 className="text-xl font-black italic tracking-tighter text-cyan-400 uppercase leading-none">
            SWAY STUDIO
          </h1>
          <span className="text-[7px] tracking-[0.5em] text-zinc-600 font-bold uppercase">
            AERO Collection
          </span>
        </div>

        <div className="hidden md:flex gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          <button
            onClick={() => setActiveSection('try-test')}
            className={`transition ${activeSection === 'try-test' ? 'text-white' : 'hover:text-zinc-300'}`}
          >
            Try &amp; Test
          </button>
          <button
            onClick={() => setActiveSection('preorder')}
            className={`transition ${activeSection === 'preorder' ? 'text-white' : 'hover:text-zinc-300'}`}
          >
            Pre-Order
          </button>
          <button
            onClick={() => setSizeGuideOpen(true)}
            className="hover:text-cyan-400 transition"
          >
            Size Guide
          </button>
          <a
            href={CONTACT_LINKS.instagram}
            target="_blank"
            rel="noreferrer"
            className="hover:text-cyan-400 transition"
          >
            Instagram
          </a>
        </div>

        <a
          href={CONTACT_LINKS.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="text-[10px] uppercase font-black tracking-widest bg-cyan-400 text-black px-5 py-2 rounded-full shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 transition"
        >
          WhatsApp
        </a>
      </nav>

      {/* ── SECTION TABS ── */}
      <div className="pt-24 px-6 flex justify-center gap-3 pb-6 sticky top-0 bg-[#080808] z-40 border-b border-white/5">
        {(
          [
            { id: 'try-test', label: 'Try & Test' },
            { id: 'preorder', label: 'Pre Order' },
          ] as { id: Section; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.25em] transition-all border-2 ${
              activeSection === tab.id
                ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/25'
                : 'border-white/10 text-zinc-600 hover:border-white/25 hover:text-zinc-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════════════════════════════════
          TRY & TEST SECTION
      ══════════════════════════════════════ */}
      {activeSection === 'try-test' && (
        <section className="px-6 md:px-16 pt-10 pb-32">
          <header className="text-center mb-12">
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white leading-none mb-3">
              AERO Collection
            </h2>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] font-bold">
              Try it live before you buy
            </p>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4" />
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {TRY_TEST_PRODUCTS.map((prod, idx) => (
              <div key={idx} className="group flex flex-col items-center">
                <div className="relative w-full aspect-[3/4] rounded-[36px] overflow-hidden bg-zinc-900 border border-white/8 shadow-2xl mb-5">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
                  <button
                    onClick={() => openTryOn(prod)}
                    className="absolute bottom-5 left-5 right-5 bg-white text-black py-4 rounded-full text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 shadow-2xl hover:bg-cyan-400"
                  >
                    Launch AI Studio
                  </button>
                </div>

                <h3 className="text-xs font-black uppercase tracking-tight text-zinc-200 mb-2 text-center">
                  {prod.name}
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black text-cyan-400 italic">
                    EGP {prod.price}.00
                  </span>
                  {prod.oldPrice && (
                    <span className="text-xs text-zinc-600 font-bold line-through italic">
                      EGP {prod.oldPrice}.00
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════
          PRE-ORDER SECTION
      ══════════════════════════════════════ */}
      {activeSection === 'preorder' && (
        <section className="px-6 md:px-16 pt-10 pb-32 max-w-4xl mx-auto">
          <header className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.6em] text-cyan-400 font-black mb-2">
              Exclusive Drop
            </p>
            <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter uppercase text-white leading-none mb-3">
              Eternity Protocol
            </h2>
            <p className="text-zinc-500 text-xs uppercase tracking-[0.4em] font-bold">
              Reserve your piece before it's gone
            </p>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto mt-4" />
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {PREORDER_PRODUCT.variants!.map((v) => (
              <button
                key={v.colorName}
                onClick={() => setPreorderVariant(v)}
                className={`group relative aspect-[3/4] rounded-[36px] overflow-hidden border-2 transition-all duration-300 ${
                  preorderVariant.colorName === v.colorName
                    ? 'border-cyan-400 shadow-xl shadow-cyan-400/20'
                    : 'border-white/10 hover:border-white/30'
                }`}
              >
                <img
                  src={v.url}
                  alt={v.colorName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-widest text-white">
                    {v.colorName}
                  </span>
                  {preorderVariant.colorName === v.colorName && (
                    <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Price */}
          <div className="text-center mb-8">
            <span className="text-3xl font-black text-cyan-400 italic">
              EGP {PREORDER_PRODUCT.price}.00
            </span>
          </div>

          {/* Size selector */}
          <div className="bg-zinc-950 border border-white/8 rounded-3xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Select Size
              </p>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="text-[9px] font-black text-cyan-400 hover:text-white transition uppercase tracking-widest"
              >
                Size Guide →
              </button>
            </div>
            <div className="flex justify-center gap-3 flex-wrap">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setPreorderSize(s)}
                  className={`w-12 h-12 border-2 rounded-xl font-black text-sm transition-all ${
                    preorderSize === s
                      ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                      : 'border-white/10 text-zinc-600 hover:border-white/30 hover:text-zinc-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={sendPreorder}
            className="w-full bg-[#25D366] text-white py-5 rounded-full text-xs font-black uppercase tracking-[0.4em] shadow-2xl shadow-[#25D366]/20 hover:bg-[#1fbd58] transition-all hover:scale-[0.98] flex items-center justify-center gap-3"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Pre-order via WhatsApp — {preorderVariant.colorName} / {preorderSize}
          </button>

          <p className="text-center text-[10px] text-zinc-600 mt-4 tracking-widest uppercase">
            You will be redirected to WhatsApp to confirm your order
          </p>
        </section>
      )}

      {/* ══════════════════════════════════════
          TRY-ON MODAL
      ══════════════════════════════════════ */}
      {tryOnOpen && tryOnProduct && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl overflow-y-auto">
          <div className="min-h-full flex flex-col items-center px-6 py-10">
            {/* Close */}
            <div className="w-full max-w-lg flex justify-end mb-4">
              <button
                onClick={closeTryOn}
                className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest border border-white/10 px-5 py-2 rounded-full transition hover:border-white/30"
              >
                ✕ Close Studio
              </button>
            </div>

            <div className="w-full max-w-lg">
              {/* Product info */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none mb-1">
                  {tryOnProduct.name}
                </h2>
                <p className="text-cyan-400 font-black italic text-lg">
                  EGP {tryOnProduct.price}.00
                </p>
              </div>

              {/* Size selector */}
              <div className="bg-zinc-950 border border-white/8 rounded-2xl p-5 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                    Select Size
                  </p>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="text-[9px] font-black text-cyan-400 hover:text-white transition uppercase tracking-widest"
                  >
                    Guide →
                  </button>
                </div>
                <div className="flex justify-center gap-3 flex-wrap">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setTryOnSize(s)}
                      className={`w-11 h-11 border-2 rounded-xl font-black text-sm transition-all ${
                        tryOnSize === s
                          ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                          : 'border-white/10 text-zinc-600 hover:border-white/30 hover:text-zinc-400'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Try-on engine */}
              <TryOnEngine
                itemUrl={tryOnImage}
                selectedSize={tryOnSize}
                productName={tryOnProduct.name}
              />

              {/* Buy CTA */}
              <a
                href={`${CONTACT_LINKS.whatsapp}&text=${encodeURIComponent(
                  `Hello, I want to order *${tryOnProduct.name}*.\nSize: ${tryOnSize}\nPlease confirm availability.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 block w-full bg-white text-black py-5 rounded-full text-center text-xs font-black uppercase tracking-[0.4em] shadow-2xl hover:bg-cyan-400 hover:scale-[0.98] transition-all"
              >
                Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ── SIZE GUIDE ── */}
      <SizeGuide isOpen={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </main>
  )
}
