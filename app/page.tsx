'use client'
import { useState, useEffect } from 'react'
import { COLLECTIONS, CONTACT_LINKS } from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'

export default function Home() {
  const [activeTab, setActiveTab] = useState(COLLECTIONS[0].id)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [activeImage, setActiveImage] = useState('')
  const [selectedSize, setSelectedSize] = useState('L')
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)

  const currentCollection = COLLECTIONS.find(c => c.id === activeTab)

  useEffect(() => {
    const col = COLLECTIONS.find(c => c.id === activeTab)
    if (col) {
      setSelectedProduct(col.products[0])
      setActiveImage(col.products[0].image)
    }
  }, [activeTab])

  if (!selectedProduct) return null

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-cyan-400">
      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 bg-black/95 backdrop-blur-xl border-b border-white/5 p-8 flex justify-between items-center px-12">
        <h1 className="text-2xl font-[1000] italic tracking-tighter text-cyan-400 leading-none uppercase">SWAY STUDIO</h1>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500">
          <span className="text-white">Shop</span>
          <span>Our Story</span>
          <span>Size Guide</span>
        </div>
      </nav>

      {/* COLLECTION TABS */}
      <div className="pt-28 px-12 pb-6 flex justify-center gap-4 overflow-x-auto no-scrollbar border-b border-white/5 sticky top-0 bg-black z-40">
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

      {/* COLLECTION TITLE */}
      <header className="py-12 text-center">
        <h2 className="text-5xl font-[1000] tracking-tighter uppercase italic text-white">{currentCollection?.name}</h2>
      </header>

      {/* PRODUCT GRID */}
      <section className="px-12 pb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {currentCollection?.products.map((prod: any, idx: number) => (
          <div key={idx} className="flex flex-col items-center group">
            <div className="relative w-full aspect-[3/4] rounded-[40px] overflow-hidden bg-zinc-900 mb-6 border border-white/5">
              <img src={prod.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="product"/>
              <button 
                onClick={() => { setSelectedProduct(prod); setActiveImage(prod.image); setIsTryOnOpen(true); }}
                className="absolute bottom-10 left-10 right-10 bg-cyan-400 text-black py-5 rounded-full text-[11px] font-[1000] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all shadow-xl"
              >
                Launch AI Fitting
              </button>
            </div>
            <h3 className="text-xs font-bold uppercase tracking-tight text-white mb-2 text-center">{prod.name}</h3>
            <div className="flex gap-4 items-center">
                <span className="text-xl font-[1000] text-cyan-400 italic">EGP {prod.price}.00</span>
                {prod.oldPrice && <span className="text-sm text-zinc-600 line-through">EGP {prod.oldPrice}.00</span>}
            </div>
          </div>
        ))}
      </section>

      {/* AI MODAL (WITH COLOR SWITCHER) */}
      {isTryOnOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6 overflow-y-auto">
          <button onClick={() => setIsTryOnOpen(false)} className="absolute top-10 right-10 text-zinc-500 uppercase text-[10px] font-black tracking-widest border border-white/10 px-6 py-2 rounded-full">✕ Close</button>
          
          <div className="w-full max-w-lg mt-20">
            <h2 className="text-white text-3xl font-[1000] italic uppercase mb-2 text-center leading-none">{selectedProduct.name}</h2>
            <p className="text-cyan-400 text-center font-black mb-8 italic">EGP {selectedProduct.price}.00</p>

            {/* COLOR SWITCHER FOR AERO */}
            {selectedProduct.variants && (
              <div className="flex justify-center gap-4 mb-8">
                {selectedProduct.variants.map((v: any) => (
                  <button 
                    key={v.colorName} 
                    onClick={() => setActiveImage(v.url)}
                    className={`px-6 py-3 rounded-xl border-2 text-[10px] font-black uppercase transition-all ${activeImage === v.url ? 'border-cyan-400 text-cyan-400' : 'border-white/10 text-zinc-600'}`}
                  >
                    {v.colorName}
                  </button>
                ))}
              </div>
            )}

            <TryOnEngine itemUrl={activeImage} />

            <div className="mt-8 flex justify-center gap-3">
              {['S', 'M', 'L', 'XL'].map(s => (
                <button key={s} onClick={() => setSelectedSize(s)} className={`w-12 h-12 border-2 rounded-xl font-black ${selectedSize === s ? 'border-[#FF00FF] text-[#FF00FF]' : 'border-white/10 text-zinc-600'}`}>{s}</button>
              ))}
            </div>

            <a 
              href={`${CONTACT_LINKS.whatsapp}&text=PREORDER: ${selectedProduct.name} | COLOR: ${activeImage.includes('47a27') ? 'White' : 'Blue'} | SIZE: ${selectedSize}`}
              className="mt-8 block w-full bg-white text-black py-6 rounded-full text-center text-xs font-[1000] uppercase tracking-widest shadow-2xl"
            >
              Confirm Preorder
            </a>
          </div>
        </div>
      )}
    </main>
  )
}
