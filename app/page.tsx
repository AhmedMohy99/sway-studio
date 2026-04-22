'use client'

import { useState, useEffect } from 'react'
import {
  TRY_TEST_PRODUCTS,
  PREORDER_PRODUCT,
  CONTACT_LINKS,
  type Product,
  type SizeOption
} from '@/lib/products'
import TryOnEngine from '@/components/TryOnEngine'

export default function Home() {
  const [tryOnOpen, setTryOnOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState<SizeOption>('L')
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  const REGULAR_SIZES: SizeOption[] = ['S', 'M', 'L', 'XL', '2XL']
  const OVERSIZED_SIZES: SizeOption[] = ['S', 'M', 'L', 'XL']

  useEffect(() => {
    document.body.style.overflow = tryOnOpen ? 'hidden' : 'unset'
  }, [tryOnOpen])

  const openTryOn = (prod: Product) => {
    setActiveProduct(prod)
    setSelectedImage(prod.variants ? prod.variants[0].tryOnImage : (prod.tryOnImage || prod.image))
    setSelectedSize('L')
    setTryOnOpen(true)
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-400 selection:text-black">
      
      {/* --- TOP BRAND BAR --- */}
      <div className="bg-cyan-400 text-black py-1.5 px-4 flex justify-between items-center overflow-hidden">
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Crafted For The Maverick</span>
        <span className="text-[10px] font-black uppercase tracking-[0.2em] hidden md:block">CREATE YOUR OWN RULES</span>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-8 py-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center font-black text-black">S</div>
          <h1 className="text-2xl font-black italic text-cyan-400 tracking-tighter">SWAY</h1>
        </div>
        <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-widest text-zinc-500">
          <button className="hover:text-white transition">Home</button>
          <button className="hover:text-white transition">Shop</button>
          <button onClick={() => setShowSizeGuide(true)} className="text-cyan-400 hover:text-white transition">Size Guide</button>
        </div>
        <a href={CONTACT_LINKS.whatsapp} className="bg-cyan-400 text-black px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.3)]">WhatsApp</a>
      </nav>

      {/* --- COLLECTION HEADER --- */}
      <div className="py-16 text-center">
        <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
          AERO <span className="text-zinc-900 drop-shadow-[0_0_2px_rgba(255,255,255,0.1)]">Collection</span>
        </h2>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-7xl mx-auto pb-40">
        {TRY_TEST_PRODUCTS.map((prod) => (
          <div key={prod.name} className="flex flex-col items-center group">
            <div className="relative w-full aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden mb-6 shadow-2xl border border-white/5">
              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <button 
                onClick={() => openTryOn(prod)}
                className="absolute inset-x-8 bottom-8 bg-white text-black py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl"
              >
                Launch AI Studio
              </button>
            </div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-2">{prod.name}</h3>
            <p className="text-[11px] font-black text-cyan-400 uppercase tracking-widest">EGP {prod.price}</p>
          </div>
        ))}
      </div>

      {/* --- SIZE GUIDE MODAL --- */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
               <h3 className="text-2xl font-black italic uppercase text-cyan-400 tracking-tighter">Size Matrix</h3>
               <button onClick={() => setShowSizeGuide(false)} className="w-10 h-10 flex items-center justify-center rounded-full bg-zinc-900 text-white">✕</button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[70vh] flex flex-col gap-10">
               <div>
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-zinc-500 mb-4">Regular Fit (Venture / Bluish)</h4>
                 <div className="border border-white/10 rounded-2xl overflow-hidden">
                   <table className="w-full text-center text-sm">
                     <thead className="bg-white text-black font-black uppercase text-[10px]">
                       <tr><th className="p-4">Size</th><th className="p-4">Width</th><th className="p-4">Length</th></tr>
                     </thead>
                     <tbody className="text-zinc-400">
                       <tr className="border-b border-white/5"><td>S</td><td>52</td><td>68</td></tr>
                       <tr className="border-b border-white/5"><td>M</td><td>54</td><td>70</td></tr>
                       <tr className="border-b border-white/5"><td>L</td><td>56</td><td>72</td></tr>
                       <tr className="border-b border-white/5"><td>XL</td><td>58</td><td>74</td></tr>
                       <tr><td>2XL</td><td>60</td><td>76</td></tr>
                     </tbody>
                   </table>
                 </div>
               </div>

               <div>
                 <h4 className="text-[11px] font-black uppercase tracking-widest text-cyan-400 mb-4">Oversized Fit (Phoenix / Catalyst / Others)</h4>
                 <div className="border border-cyan-400/20 rounded-2xl overflow-hidden">
                   <table className="w-full text-center text-sm">
                     <thead className="bg-cyan-400 text-black font-black uppercase text-[10px]">
                       <tr><th className="p-4">Size</th><th className="p-4">Width</th><th className="p-4">Length</th></tr>
                     </thead>
                     <tbody className="text-zinc-400">
                       <tr className="border-b border-white/5"><td>S</td><td>54</td><td>72.5</td></tr>
                       <tr className="border-b border-white/5"><td>M</td><td>57</td><td>73.5</td></tr>
                       <tr className="border-b border-white/5"><td>L</td><td>60</td><td>74.5</td></tr>
                       <tr><td>XL</td><td>63</td><td>76.5</td></tr>
                     </tbody>
                   </table>
                 </div>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* --- TRY-ON STUDIO MODAL --- */}
      {tryOnOpen && activeProduct && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center p-6 overflow-y-auto">
          <div className="w-full max-w-xl flex justify-between items-center mb-8 pt-6">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-cyan-400">{activeProduct.name}</h2>
            <button onClick={() => setTryOnOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-500">✕</button>
          </div>

          <div className="w-full max-w-md aspect-[3/4] bg-zinc-950 rounded-[60px] overflow-hidden border border-white/10 relative shadow-2xl">
             <TryOnEngine itemUrl={selectedImage} selectedSize={selectedSize} />
          </div>

          {activeProduct.variants && (
            <div className="mt-10 flex gap-4">
              {activeProduct.variants.map(v => (
                <button 
                  key={v.colorName} 
                  onClick={() => setSelectedImage(v.tryOnImage)}
                  className={`px-8 py-3 rounded-full text-[10px] font-black uppercase border-2 transition-all ${selectedImage === v.tryOnImage ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5' : 'border-white/10 text-zinc-600'}`}
                >
                  {v.colorName}
                </button>
              ))}
            </div>
          )}

          <div className="mt-8 flex gap-3">
            {(activeProduct.type === 'regular' ? REGULAR_SIZES : OVERSIZED_SIZES).map(s => (
              <button 
                key={s} 
                onClick={() => setSelectedSize(s)} 
                className={`w-14 h-14 rounded-2xl font-black text-sm transition-all ${selectedSize === s ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/30' : 'bg-zinc-900 text-zinc-700 border border-white/5'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <button 
             onClick={() => window.open(`${CONTACT_LINKS.whatsapp}&text=I want to order ${activeProduct.name} in size ${selectedSize}`)}
             className="mt-12 w-full max-w-md bg-white text-black py-6 rounded-full font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl hover:bg-cyan-400 transition-all active:scale-95"
          >
            Confirm Order
          </button>
        </div>
      )}
    </main>
  )
}
