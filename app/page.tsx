'use client'

import { useState, useEffect } from 'react'
import {
  TRY_TEST_PRODUCTS,
  PREORDER_PRODUCT,
  CONTACT_LINKS,
  type Product,
  type SizeOption,
  type ProductType
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

  const openTryOn = (prod: Product) => {
    setActiveProduct(prod)
    setSelectedImage(prod.variants ? prod.variants[0].tryOnImage : (prod.tryOnImage || prod.image))
    setSelectedSize('L')
    setTryOnOpen(true)
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-cyan-400 selection:text-black">
      
      {/* --- TOP BANNER --- */}
      <div className="bg-cyan-400 text-black py-1 px-4 flex justify-between items-center overflow-hidden whitespace-nowrap">
        <span className="text-[9px] font-bold uppercase tracking-widest animate-pulse">Crafted For The Maverick</span>
        <span className="text-[9px] font-bold uppercase tracking-widest hidden md:block">Designed for those who CREATE THEIR OWN RULES</span>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-cyan-400 rounded-lg flex items-center justify-center font-black text-black text-xs">S</div>
          <h1 className="text-xl font-black italic tracking-tighter uppercase text-cyan-400">SWAY</h1>
        </div>
        <div className="hidden lg:flex gap-8 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
          <button className="hover:text-white transition">Home</button>
          <button className="hover:text-white transition">Shop</button>
          <button className="hover:text-white transition">Our Story</button>
          <button onClick={() => setShowSizeGuide(true)} className="text-cyan-400">Size Guide</button>
        </div>
        <div className="flex items-center gap-5">
           <button className="text-zinc-400 text-lg">🔍</button>
           <button className="text-zinc-400 text-lg">🛒</button>
           <button className="text-zinc-400 text-lg">👤</button>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <div className="py-12 text-center">
        <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-4 italic">
          AERO <span className="text-zinc-800">Collection</span>
        </h2>
      </div>

      {/* --- PRODUCT GRID --- */}
      <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-y-16 gap-x-8 max-w-7xl mx-auto pb-32">
        {TRY_TEST_PRODUCTS.map((prod) => (
          <div key={prod.name} className="flex flex-col items-center group">
            <div className="relative w-full aspect-[3/4] bg-zinc-900 rounded-sm overflow-hidden mb-4 shadow-2xl">
              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <button 
                onClick={() => openTryOn(prod)}
                className="absolute inset-x-6 bottom-6 bg-white/90 backdrop-blur-md text-black py-4 rounded-full text-[10px] font-black uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-xl"
              >
                Launch AI Studio
              </button>
              <div className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-cyan-400 text-xs border border-white/10">♡</div>
            </div>
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-300 text-center mb-1">{prod.name}</h3>
            <p className="text-[10px] font-black text-cyan-400 uppercase">EGP {prod.price}</p>
          </div>
        ))}
      </div>

      {/* --- SIZE GUIDE MODAL --- */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
          <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
               <h3 className="text-xl font-black italic uppercase text-cyan-400">Size Matrix</h3>
               <button onClick={() => setShowSizeGuide(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="p-8 overflow-y-auto max-h-[70vh]">
               {/* REGULAR TABLE */}
               <div className="mb-10">
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-4">Regular Fit (Venture / Bluish)</h4>
                 <table className="w-full text-center border-collapse border border-white/10 text-sm">
                   <thead className="bg-white text-black font-black uppercase text-[10px]">
                     <tr><th className="p-3">Size</th><th className="p-3">Width (عرض)</th><th className="p-3">Length (طول)</th></tr>
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

               {/* OVERSIZED TABLE */}
               <div>
                 <h4 className="text-[10px] font-black uppercase tracking-widest text-cyan-400 mb-4">Oversized Fit (Phoenix / Catalyst / Others)</h4>
                 <table className="w-full text-center border-collapse border border-white/10 text-sm">
                   <thead className="bg-cyan-400 text-black font-black uppercase text-[10px]">
                     <tr><th className="p-3">Size</th><th className="p-3">Width (عرض)</th><th className="p-3">Length (طول)</th></tr>
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
      )}

      {/* --- TRY-ON STUDIO MODAL --- */}
      {tryOnOpen && activeProduct && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center p-6 overflow-y-auto">
          <div className="w-full max-w-xl flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">{activeProduct.name}</h2>
            <button onClick={() => setTryOnOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full border border-white/10 text-zinc-500">✕</button>
          </div>

          {/* ENGINE CANVAS */}
          <div className="w-full max-w-md aspect-[3/4] bg-zinc-900 rounded-[48px] overflow-hidden border border-white/10 relative shadow-2xl shadow-cyan-400/5">
             <TryOnEngine itemUrl={selectedImage} selectedSize={selectedSize} />
          </div>

          {/* COLOR PICKER (IF APPLICABLE) */}
          {activeProduct.variants && (
            <div className="mt-8 flex gap-3">
              {activeProduct.variants.map(v => (
                <button 
                  key={v.colorName} 
                  onClick={() => setSelectedImage(v.tryOnImage)}
                  className={`px-5 py-2 rounded-full text-[10px] font-black uppercase border-2 transition-all ${selectedImage === v.tryOnImage ? 'border-cyan-400 text-cyan-400 bg-cyan-400/5' : 'border-white/10 text-zinc-600'}`}
                >
                  {v.colorName}
                </button>
              ))}
            </div>
          )}

          {/* SIZE PICKER (CORRECTED BY TYPE) */}
          <div className="mt-8 flex gap-2">
            {(activeProduct.type === 'regular' ? REGULAR_SIZES : OVERSIZED_SIZES).map(s => (
              <button 
                key={s} 
                onClick={() => setSelectedSize(s)} 
                className={`w-12 h-12 rounded-xl font-black text-xs transition-all ${selectedSize === s ? 'bg-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'bg-zinc-900 text-zinc-700 border border-white/5'}`}
              >
                {s}
              </button>
            ))}
          </div>

          <button 
             onClick={() => window.open(`${CONTACT_LINKS.whatsapp}&text=I want to order ${activeProduct.name} in size ${selectedSize}`)}
             className="mt-10 w-full max-w-md bg-white text-black py-6 rounded-full font-black uppercase text-xs shadow-2xl hover:bg-cyan-400 transition-all active:scale-95"
          >
            Confirm Order via WhatsApp
          </button>
        </div>
      )}

      {/* FLOATING WHATSAPP */}
      <a href={CONTACT_LINKS.whatsapp} className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center text-white text-2xl shadow-2xl hover:scale-110 transition-transform">
        💬
      </a>
    </main>
  )
}
