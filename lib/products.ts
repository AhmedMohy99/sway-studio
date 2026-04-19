'use client'
import { useState, useEffect } from 'react'
import { COLLECTIONS, CONTACT_LINKS } from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'
import SizeGuide from '@/components/SizeGuide'

export default function Home() {
  // Ensure we start with a valid collection ID
  const [activeTab, setActiveTab] = useState('aero-collection')
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  
  // Set default state to the first product of the first collection
  const [selectedProduct, setSelectedProduct] = useState<any>(COLLECTIONS[0].products[0])
  const [activeImage, setActiveImage] = useState(COLLECTIONS[0].products[0].image)
  const [selectedSize, setSelectedSize] = useState('L')

  const currentCollection = COLLECTIONS.find(c => c.id === activeTab)

  // Force update when clicking a new collection tab
  useEffect(() => {
    const col = COLLECTIONS.find(c => c.id === activeTab)
    if (col && col.products.length > 0) {
      setSelectedProduct(col.products[0])
      setActiveImage(col.products[0].image)
    }
  }, [activeTab])

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-400 pb-20">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/5 p-8 flex justify-between items-center px-12">
        <h1 className="text-2xl font-[1000] italic tracking-tighter text-cyan-400 uppercase">SWAY STUDIO</h1>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          <span onClick={() => setIsSizeGuideOpen(true)} className="hover:text-cyan-400 cursor-pointer">Size Guide</span>
          <a href={CONTACT_LINKS.whatsapp} target="_blank" className="hover:text-cyan-400">Contact</a>
        </div>
      </nav>

      {/* COLLECTION PILLS */}
      <div className="pt-28 px-6 flex justify-center gap-3 overflow-x-auto no-scrollbar pb-8 sticky top-0 bg-black z-40 border-b border-white/5">
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

      {/* DYNAMIC HEADER */}
      <header className="py-12 text-center">
        <h2 className="text-5xl font-[1000] tracking-tighter uppercase italic text-white mb-2 leading-tight">
          {currentCollection?.name}
        </h2>
        <div className="h-1.5 w-24 bg-cyan-400 mx-auto rounded-full shadow-[0_0_15px_rgba(0,245,255,0.5)]"></div>
      </header>

      {/* PRODUCT GRID - THIS SHOWS THE PRODUCTS */}
      <section className="px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {currentCollection?.products.map((prod: any, idx: number) => (
          <div key={idx} className="flex flex-col items-center group">
            <div className="relative w-full aspect-[3/4] rounded-[40px] overflow-hidden bg-zinc-900 mb-8 border border-white/10 shadow-2xl">
              <img src={prod.image} className="w-full h-full object-cover" alt="Product" />
              <button 
                onClick={() => { setSelectedProduct(prod); setActiveImage(prod.image); setIsTryOnOpen(true); }}
                className="absolute bottom-8 left-8 right-8 bg-white text-black py-5 rounded-full text-[10px] font-[1000] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all shadow-2xl"
              >
                Launch AI Studio
              </button>
            </div>
            <h3 className="text-xs font-black uppercase tracking-tight text-zinc-200 mb-2 text-center">{prod.name}</h3>
            <span className="text-2xl font-[1000] text-cyan-400 italic">EGP {prod.price}.00</span>
          </div>
        ))}
      </section>

      {/* AI POPUP */}
      {isTryOnOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 overflow-y-auto">
          <button onClick={() => setIsTryOnOpen(false)} className="absolute top-10 right-10 text-zinc-500 uppercase text-[10px] font-black tracking-widest border border-white/10 px-6 py-2 rounded-full">✕ Close</button>
          <div className="w-full max-w-lg mt-20">
            {selectedProduct.variants && (
              <div className="flex justify-center gap-3 mb-8">
                {selectedProduct.variants.map((v: any) => (
                  <button key={v.colorName} onClick={() => setActiveImage(v.url)} className={`px-6 py-3 rounded-xl border-2 text-[10px] font-black uppercase ${activeImage === v.url ? 'border-cyan-400 text-cyan-400' : 'border-white/10 text-zinc-600'}`}>{v.colorName}</button>
                ))}
              </div>
            )}
            <TryOnEngine itemUrl={activeImage} />
            <a href={`${CONTACT_LINKS.whatsapp}&text=ORDER: ${selectedProduct.name} | SIZE: ${selectedSize}`} className="mt-10 block w-full bg-white text-black py-6 rounded-full text-center text-xs font-[1000] uppercase tracking-[0.4em]">Preorder Now</a>
          </div>
        </div>
      )}

      <SizeGuide isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </main>
  )
}
