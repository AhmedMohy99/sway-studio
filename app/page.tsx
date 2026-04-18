'use client'
import { useState } from 'react'
import { COLLECTIONS, CONTACT_LINKS } from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'

export default function Home() {
  const [activeTab, setActiveTab] = useState(COLLECTIONS[0].id)
  const currentCollection = COLLECTIONS.find(c => c.id === activeTab)
  
  const [selectedProduct, setSelectedProduct] = useState(currentCollection?.products[0])
  const [selectedSize, setSelectedSize] = useState('L')
  const [activeColor, setActiveColor] = useState('White Base')
  const [isTryOnOpen, setIsTryOnOpen] = useState(false)

  const handleColorChange = (color: string, img: string) => {
    setActiveColor(color);
    setSelectedProduct({ ...selectedProduct, image: img });
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-cyan-400">
      {/* HEADER */}
      <nav className="p-8 flex justify-between items-center border-b border-white/5 px-12 sticky top-0 bg-black/90 backdrop-blur-xl z-50">
        <div className="flex flex-col">
          <h1 className="text-2xl font-[1000] italic tracking-tighter text-cyan-400 leading-none">SWAY STUDIO</h1>
          <span className="text-[7px] tracking-[0.5em] text-zinc-500 font-bold uppercase mt-1">AI Powered Fitting</span>
        </div>
        <div className="hidden md:flex gap-10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
           <span>Home</span> <span className="text-white">Shop</span> <span>Story</span>
        </div>
      </nav>

      {/* TABS */}
      <div className="px-12 py-6 flex gap-4 overflow-x-auto no-scrollbar border-b border-white/5">
        {COLLECTIONS.map(col => (
          <button 
            key={col.id}
            onClick={() => { setActiveTab(col.id); setSelectedProduct(col.products[0]); }}
            className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border-2 ${
              activeTab === col.id ? 'bg-cyan-400 border-cyan-400 text-black shadow-[0_0_20px_rgba(0,245,255,0.4)]' : 'border-white/10 text-zinc-600'
            }`}
          >
            {col.name}
          </button>
        ))}
      </div>

      {/* PRODUCT DISPLAY */}
      <div className="grid lg:grid-cols-2 min-h-[85vh]">
        {/* LEFT: IMAGE */}
        <div className="p-10 flex items-center justify-center border-r border-white/5 relative group">
          <div className="w-full max-w-lg aspect-[3/4] bg-zinc-900 rounded-[40px] overflow-hidden relative border border-white/10">
            <img src={selectedProduct?.image} className="w-full h-full object-cover" alt="product"/>
            <button onClick={() => setIsTryOnOpen(true)} className="absolute bottom-10 left-10 right-10 bg-cyan-400 text-black py-5 rounded-full text-[11px] font-[1000] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all shadow-xl">
              Launch AI Try-On
            </button>
          </div>
        </div>

        {/* RIGHT: DETAILS */}
        <div className="p-20 flex flex-col justify-center">
          <h2 className="text-6xl font-[1000] italic tracking-tighter uppercase mb-2">{selectedProduct?.name}</h2>
          <p className="text-[10px] font-black tracking-widest text-zinc-600 uppercase mb-8">SKU: {selectedProduct?.sku}</p>
          <p className="text-4xl font-[1000] italic text-cyan-400 mb-12">EGP {selectedProduct?.price}.00</p>

          {/* COLOR OPTIONS */}
          {selectedProduct?.variants && (
            <div className="mb-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">Color Selection:</p>
              <div className="flex gap-3">
                {selectedProduct.variants.map((v: any) => (
                  <button 
                    key={v.color}
                    onClick={() => handleColorChange(v.color, v.img)}
                    className={`px-6 py-3 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeColor === v.color ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5' : 'border-white/10 text-zinc-600'
                    }`}
                  >
                    {v.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZE SELECTOR */}
          <div className="mb-12">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">Size Selection:</p>
            <div className="flex gap-3">
              {['S', 'M', 'L', 'XL', '2XL'].map(s => (
                <button 
                  key={s} 
                  onClick={() => setSelectedSize(s)}
                  className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 font-black transition-all ${
                    selectedSize === s ? 'border-[#FF00FF] text-[#FF00FF] shadow-[0_0_15px_rgba(255,0,255,0.2)]' : 'border-white/10 text-zinc-600'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <a 
            href={`${CONTACT_LINKS.whatsapp}&text=ORDER: ${selectedProduct?.name} | COLOR: ${activeColor} | SIZE: ${selectedSize}`}
            className="w-full bg-white text-black py-6 rounded-full text-xs font-[1000] uppercase tracking-[0.4em] text-center hover:bg-cyan-400 transition-all shadow-2xl"
          >
            Confirm Preorder
          </a>
        </div>
      </div>

      {/* MODAL */}
      {isTryOnOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex flex-col items-center justify-center p-6">
          <button onClick={() => setIsTryOnOpen(false)} className="absolute top-10 right-10 text-zinc-500 uppercase text-[10px] font-black tracking-widest border border-white/10 px-6 py-2 rounded-full">✕ Close</button>
          <div className="w-full max-w-lg">
            <TryOnEngine itemUrl={selectedProduct?.image} />
          </div>
        </div>
      )}
    </main>
  )
}
