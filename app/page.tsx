'use client'
import { useState, useEffect } from 'react'
import { COLLECTIONS, CONTACT_LINKS } from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'
import SizeGuide from '@/components/SizeGuide'

export default function Home() {
  const [activeTab, setActiveTab] = useState(COLLECTIONS[0].id)
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  
  // Set default state to the first product of the default collection
  const [selectedProduct, setSelectedProduct] = useState<any>(COLLECTIONS[0].products[0])
  const [activeImage, setActiveImage] = useState(COLLECTIONS[0].products[0].image)
  const [selectedSize, setSelectedSize] = useState('L')

  const currentCollection = COLLECTIONS.find(c => c.id === activeTab)

  // Force content to switch when collection tab is clicked
  useEffect(() => {
    const col = COLLECTIONS.find(c => c.id === activeTab)
    if (col && col.products.length > 0) {
      setSelectedProduct(col.products[0])
      setActiveImage(col.products[0].image)
    }
  }, [activeTab])

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-400">
      {/* 1. TOP NAV */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/5 p-8 flex justify-between items-center px-12">
        <h1 className="text-2xl font-[1000] italic tracking-tighter text-cyan-400 uppercase">SWAY STUDIO</h1>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          <span onClick={() => setIsSizeGuideOpen(true)} className="hover:text-cyan-400 cursor-pointer">Size Guide</span>
          <a href={CONTACT_LINKS.whatsapp} target="_blank">Contact</a>
        </div>
      </nav>

      {/* 2. COLLECTION BUTTONS */}
      <div className="pt-28 px-6 flex justify-center gap-3 overflow-x-auto no-scrollbar pb-8 sticky top-0 bg-black z-40 border-b border-white/5">
        {COLLECTIONS.map(col => (
          <button 
            key={col.id}
            onClick={() => setActiveTab(col.id)}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
              activeTab === col.id ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/30' : 'border-white/10 text-zinc-600'
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {/* 3. DYNAMIC HEADER */}
      <header className="py-12 text-center">
        <h2 className="text-6xl font-[1000] tracking-tighter uppercase italic text-white mb-2 leading-none">
          {currentCollection?.name}
        </h2>
        <div className="h-1.5 w-24 bg-cyan-400 mx-auto rounded-full shadow-lg"></div>
      </header>

      {/* 4. GRID OF ALL PRODUCTS */}
      <section className="px-6 md:px-16 pb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {currentCollection?.products.map((prod: any, idx: number) => (
          <div key={idx} className="flex flex-col items-center group">
            <div className="relative w-full aspect-[3/4] rounded-[40px] overflow-hidden bg-zinc-900 mb-8 border border-white/10 shadow-2xl">
              <img src={prod.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={prod.name} />
              <button 
                onClick={() => { setSelectedProduct(prod); setActiveImage(prod.image); setIsTryOnOpen(true); }}
                className="absolute bottom-8 left-8 right-8 bg-white text-black py-5 rounded-full text-[10px] font-[1000] uppercase opacity-0 group-hover:opacity-100 transition-all"
              >
                Launch AI Fit
              </button>
            </div>
            <h3 className="text-xs font-black uppercase tracking-tight text-zinc-200 mb-2">{prod.name}</h3>
            <div className="flex gap-4 items-center">
                <span className="text-2xl font-[1000] text-cyan-400 italic">EGP {prod.price}.00</span>
                {prod.oldPrice && <span className="text-xs text-zinc-600 line-through">EGP {prod.oldPrice}.00</span>}
            </div>
          </div>
        ))}
      </section>

      {/* 5. MODALS */}
      {isTryOnOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 overflow-y-auto">
          <button onClick={() => setIsTryOnOpen(false)} className="absolute top-10 right-10 text-zinc-500 uppercase text-[10px] font-black border border-white/10 px-6 py-2 rounded-full">✕ Close</button>
          <div className="w-full max-w-lg mt-20">
            {selectedProduct.variants && (
              <div className="flex justify-center gap-3 mb-8">
                {selectedProduct.variants.map((v: any) => (
                  <button key={v.colorName} onClick={() => setActiveImage(v.url)} className={`px-6 py-3 rounded-xl border-2 text-[10px] font-black uppercase ${activeImage === v.url ? 'border-cyan-400 text-cyan-400' : 'border-white/10 text-zinc-600'}`}>{v.colorName}</button>
                ))}
              </div>
            )}
            <TryOnEngine itemUrl={activeImage} />
            <a href={`${CONTACT_LINKS.whatsapp}&text=ORDER: ${selectedProduct.name} | SIZE: ${selectedSize}`} className="mt-10 block w-full bg-white text-black py-6 rounded-full text-center text-xs font-[1000] uppercase tracking-[0.4em]">Preorder</a>
          </div>
        </div>
      )}

      <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </main>
  )
}
