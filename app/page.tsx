'use client'

import { useState, useEffect } from 'react'
import { COLLECTIONS, CONTACT_LINKS } from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'
import SizeGuide from '@/components/SizeGuide'

type SizeOption = 'S' | 'M' | 'L' | 'XL' | '2XL'

export default function Home() {
  const [activeTab, setActiveTab] = useState(COLLECTIONS[0].id)
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [activeImage, setActiveImage] = useState('')
  const [selectedSize, setSelectedSize] = useState<SizeOption>('L')

  const currentCollection = COLLECTIONS.find((c) => c.id === activeTab)

  const getTryOnImage = (productOrVariant: any) => {
    return (
      productOrVariant?.tryOnImage ||
      productOrVariant?.transparentImage ||
      productOrVariant?.overlayImage ||
      productOrVariant?.png ||
      productOrVariant?.url ||
      productOrVariant?.image ||
      ''
    )
  }

  useEffect(() => {
    const col = COLLECTIONS.find((c) => c.id === activeTab)

    if (col && col.products.length > 0) {
      const firstProd = col.products[0]
      setSelectedProduct(firstProd)
      setActiveImage(getTryOnImage(firstProd))
      setSelectedSize('L')
    }
  }, [activeTab])

  if (!selectedProduct) return null

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-400">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/5 p-8 flex justify-between items-center px-12">
        <div className="flex flex-col">
          <h1 className="text-2xl font-[1000] italic tracking-tighter text-cyan-400 leading-none uppercase">
            SWAY STUDIO
          </h1>
          <span className="text-[7px] tracking-[0.5em] text-zinc-500 font-bold uppercase mt-1">
            AI Powered Fitting
          </span>
        </div>

        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          <span className="text-white">Shop</span>
          <span
            onClick={() => setIsSizeGuideOpen(true)}
            className="hover:text-cyan-400 cursor-pointer transition"
          >
            Size Guide
          </span>
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
          className="text-[10px] uppercase font-black tracking-widest bg-cyan-400 text-black px-6 py-2 rounded-full shadow-lg shadow-cyan-400/20"
        >
          WhatsApp
        </a>
      </nav>

      {/* TABS */}
      <div className="pt-28 px-6 flex justify-center gap-3 overflow-x-auto no-scrollbar pb-8 sticky top-0 bg-black z-40 border-b border-white/5">
        {COLLECTIONS.map((col) => (
          <button
            key={col.id}
            onClick={() => setActiveTab(col.id)}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
              activeTab === col.id
                ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/30'
                : 'border-white/10 text-zinc-600 hover:border-white/30'
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {/* HEADER */}
      <header className="py-12 text-center">
        <h2 className="text-4xl md:text-6xl font-[1000] tracking-tighter uppercase italic text-white mb-2 leading-tight">
          {currentCollection?.name}
        </h2>
        <div className="h-1.5 w-24 bg-cyan-400 mx-auto rounded-full" />
      </header>

      {/* PRODUCTS */}
      <section className="px-6 md:px-16 pb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {currentCollection?.products.map((prod: any, idx: number) => (
          <div key={idx} className="flex flex-col items-center group">
            <div className="relative w-full aspect-[3/4] rounded-[40px] overflow-hidden bg-zinc-900 mb-8 border border-white/10 shadow-2xl">
              <img
                src={prod.image}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                alt={prod.name}
              />

              <button
                onClick={() => {
                  // ✅ PREORDER FLOW
                  if (activeTab === 'preorder') {
                    const message = `PREORDER REQUEST:
Product: ${prod.name}
Size: ${selectedSize}

I checked the size guide and I want to preorder this piece.`

                    window.open(
                      `${CONTACT_LINKS.whatsapp}&text=${encodeURIComponent(message)}`
                    )
                    return
                  }

                  // ✅ TRY-ON FLOW
                  setSelectedProduct(prod)
                  setActiveImage(getTryOnImage(prod))
                  setSelectedSize('L')
                  setIsTryOnOpen(true)
                }}
                className="absolute bottom-8 left-8 right-8 bg-white text-black py-5 rounded-full text-[10px] font-[1000] uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl"
              >
                {activeTab === 'preorder' ? 'Preorder via WhatsApp' : 'Launch AI Studio'}
              </button>
            </div>

            <h3 className="text-xs font-black uppercase tracking-tight text-zinc-200 mb-2 text-center">
              {prod.name}
            </h3>

            <div className="flex gap-4 items-center">
              <span className="text-2xl font-[1000] text-cyan-400 italic">
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
      </section>

      {/* TRY ON MODAL */}
      {isTryOnOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 overflow-y-auto">
          <button
            onClick={() => setIsTryOnOpen(false)}
            className="absolute top-10 right-10 text-zinc-500 hover:text-white uppercase text-[10px] font-black tracking-widest border border-white/10 px-6 py-2 rounded-full transition"
          >
            ✕ Close Studio
          </button>

          <div className="w-full max-w-lg mt-20 text-left">
            <h2 className="text-white text-4xl font-[1000] italic uppercase mb-2 text-center">
              {selectedProduct.name}
            </h2>

            <p className="text-cyan-400 font-black mb-8 italic text-lg text-center">
              EGP {selectedProduct.price}.00
            </p>

           <div className="flex justify-center gap-3 mb-6 flex-wrap">
  {(['S', 'M', 'L', 'XL', '2XL'] as const).map((s) => (
    <button
      key={s}
      onClick={() => setSelectedSize(s)}
      className={`w-12 h-12 border rounded-lg ${
        selectedSize === s
          ? 'border-cyan-400 text-cyan-400'
          : 'border-white/10 text-gray-500'
      }`}
    >
      {s}
    </button>
  ))}
</div>

<TryOnEngine
  itemUrl={activeImage}
  selectedSize={selectedSize}
  productName={selectedProduct.name}
/>
          </div>
        </div>
      )}

      <SizeGuide
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </main>
  )
}
