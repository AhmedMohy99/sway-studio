'use client'

import { useState, useEffect, useRef } from 'react'
import {
  TRY_TEST_PRODUCTS,
  CONTACT_LINKS,
  SIZES,
  type Product,
  type SizeOption
} from '@/lib/products'

export default function Home() {
  const [tryOnOpen, setTryOnOpen] = useState(false)
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState('')
  const [selectedSize, setSelectedSize] = useState<SizeOption>('L')
  const [mode, setMode] = useState<'camera' | 'upload'>('camera')
  const [userImg, setUserImg] = useState<string | null>(null)
  const [scale, setScale] = useState(100)
  const [offsetY, setOffsetY] = useState(0)
  const [showSizeGuide, setShowSizeGuide] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Auto-lock scroll
  useEffect(() => {
    document.body.style.overflow = tryOnOpen ? 'hidden' : 'unset'
  }, [tryOnOpen])

  // Camera Logic
  useEffect(() => {
    if (tryOnOpen && mode === 'camera') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
        .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream })
        .catch(err => console.error("Camera error:", err))
    } else {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop())
      }
    }
  }, [tryOnOpen, mode])

  // Rendering Loop
  useEffect(() => {
    let frameId: number
    const draw = () => {
      const canvas = canvasRef.current
      const ctx = canvas?.getContext('2d')
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 1. Draw Background (Camera or Upload)
      if (mode === 'camera' && videoRef.current) {
        ctx.save()
        ctx.scale(-1, 1) // Mirror camera
        ctx.drawImage(videoRef.current, -canvas.width, 0, canvas.width, canvas.height)
        ctx.restore()
      } else if (mode === 'upload' && userImg) {
        const img = new Image(); img.src = userImg
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }

      // 2. Draw Garment Overlay
      if (selectedImage) {
        const garment = new Image(); garment.src = selectedImage
        const w = (canvas.width * (scale / 100))
        const h = w * 1.2 
        const x = (canvas.width - w) / 2
        const y = ((canvas.height - h) / 2) + offsetY
        ctx.drawImage(garment, x, y, w, h)
      }
      frameId = requestAnimationFrame(draw)
    }
    if (tryOnOpen) draw()
    return () => cancelAnimationFrame(frameId)
  }, [tryOnOpen, mode, userImg, selectedImage, scale, offsetY])

  const openTryOn = (prod: Product) => {
    setActiveProduct(prod)
    setSelectedImage(prod.variants ? prod.variants[0].tryOnImage : (prod.tryOnImage || prod.image))
    setTryOnOpen(true)
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (prev) => { setUserImg(prev.target?.result as string); setMode('upload') }
      reader.readAsDataURL(file)
    }
  }

  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-400 selection:text-black">
      
      {/* --- PREMIUM TOP BAR --- */}
      <div className="bg-cyan-400 text-black py-2 px-6 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
        <span>Crafted For The Maverick</span>
        <span className="hidden md:block">Designed for those who CREATE THEIR OWN RULES</span>
      </div>

      {/* --- NAVBAR --- */}
      <nav className="flex items-center justify-between px-8 py-8 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-400 rounded-xl flex items-center justify-center font-black text-black text-lg">S</div>
          <h1 className="text-2xl font-black italic text-cyan-400 tracking-tighter">SWAY STUDIO</h1>
        </div>
        <div className="hidden lg:flex gap-10 text-[11px] font-black uppercase tracking-widest text-zinc-500">
          <button className="hover:text-white transition">Home</button>
          <button className="hover:text-white transition">Shop</button>
          <button onClick={() => setShowSizeGuide(true)} className="text-cyan-400 hover:brightness-125 transition">Size Guide</button>
        </div>
        <a href={CONTACT_LINKS.whatsapp} target="_blank" className="bg-cyan-400 text-black px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.3)]">WhatsApp</a>
      </nav>

      {/* --- HERO --- */}
      <div className="py-20 text-center">
        <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter italic">
          AERO <span className="text-zinc-900 drop-shadow-[0_0_1px_rgba(255,255,255,0.2)]">Collection</span>
        </h2>
        <p className="text-zinc-600 text-[10px] uppercase tracking-[0.5em] mt-4 font-bold">AI Virtual Try-On — See it on you before you buy</p>
      </div>

      {/* --- GRID --- */}
      <div className="px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 max-w-7xl mx-auto pb-40">
        {TRY_TEST_PRODUCTS.map((prod) => (
          <div key={prod.name} className="flex flex-col items-center group">
            <div className="relative w-full aspect-[3/4] bg-zinc-950 rounded-[40px] overflow-hidden mb-8 border border-white/5 shadow-2xl">
              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
              <button 
                onClick={() => openTryOn(prod)}
                className="absolute inset-x-10 bottom-10 bg-white text-black py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all shadow-2xl"
              >
                Launch AI Studio
              </button>
            </div>
            <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-zinc-400 text-center mb-2">{prod.name}</h3>
            <p className="text-[11px] font-black text-cyan-400 uppercase">EGP {prod.price}</p>
          </div>
        ))}
      </div>

      {/* --- AR MODAL --- */}
      {tryOnOpen && activeProduct && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center p-6 overflow-y-auto animate-in fade-in duration-300">
          <div className="w-full max-w-xl flex justify-between items-center mb-8 pt-4">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white">{activeProduct.name}</h2>
            <button onClick={() => setTryOnOpen(false)} className="w-12 h-12 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-500 hover:text-white">✕</button>
          </div>

          {/* MODE SELECTOR */}
          <div className="flex gap-4 mb-8 bg-zinc-950 p-2 rounded-3xl border border-white/5 w-full max-w-md">
            <button onClick={() => setMode('camera')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase transition-all ${mode === 'camera' ? 'bg-white text-black shadow-xl' : 'text-zinc-600'}`}>📷 Camera</button>
            <label className={`flex-1 py-4 text-center rounded-2xl text-[10px] font-black uppercase cursor-pointer transition-all ${mode === 'upload' ? 'bg-white text-black shadow-xl' : 'text-zinc-600'}`}>
              🖼️ Upload Photo
              <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
            </label>
          </div>

          {/* AR CANVAS */}
          <div className="w-full max-w-md aspect-[3/4] rounded-[60px] overflow-hidden bg-zinc-950 border border-white/10 relative shadow-2xl">
             <video ref={videoRef} autoPlay playsInline className="hidden" />
             <canvas ref={canvasRef} width={800} height={1066} className="w-full h-full object-cover" />
             
             {/* MANUAL CONTROLS */}
             <div className="absolute right-6 bottom-32 flex flex-col gap-4">
                <button onClick={() => setOffsetY(prev => prev - 10)} className="w-12 h-12 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-xl hover:bg-cyan-400 hover:text-black">↑</button>
                <button onClick={() => setOffsetY(prev => prev + 10)} className="w-12 h-12 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center justify-center text-xl hover:bg-cyan-400 hover:text-black">↓</button>
             </div>
          </div>

          {/* SCALE SLIDER */}
          <div className="w-full max-w-md mt-10">
            <div className="flex justify-between mb-4 px-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Garment Scale</span>
              <span className="text-cyan-400 font-black text-xs">{scale}%</span>
            </div>
            <input 
              type="range" min="50" max="150" value={scale} 
              onChange={(e) => setScale(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* SIZES */}
          <div className="mt-10 flex gap-3">
             {(activeProduct.type === 'regular' ? ['S','M','L','XL','2XL'] : ['S','M','L','XL']).map(s => (
               <button 
                key={s} 
                onClick={() => setSelectedSize(s as SizeOption)}
                className={`w-14 h-14 rounded-2xl font-black text-sm transition-all border-2 ${selectedSize === s ? 'bg-cyan-400 border-cyan-400 text-black shadow-lg shadow-cyan-400/20' : 'bg-zinc-950 border-white/5 text-zinc-600'}`}
               >
                 {s}
               </button>
             ))}
          </div>

          <button 
            onClick={() => window.open(`${CONTACT_LINKS.whatsapp}&text=Order: ${activeProduct.name} | Size: ${selectedSize}`)}
            className="mt-12 w-full max-w-md bg-white text-black py-7 rounded-full font-black uppercase text-xs tracking-[0.4em] shadow-2xl hover:bg-cyan-400 transition-all active:scale-95 mb-20"
          >
            Confirm Order via WhatsApp
          </button>
        </div>
      )}

      {/* --- SIZE GUIDE MODAL --- */}
      {showSizeGuide && (
        <div className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-6" onClick={() => setShowSizeGuide(false)}>
          <div className="w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-[40px] overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-white/5 flex justify-between items-center">
              <h3 className="text-2xl font-black italic uppercase text-cyan-400 tracking-tighter">Size Matrix</h3>
              <button onClick={() => setShowSizeGuide(false)} className="text-zinc-500">✕</button>
            </div>
            <div className="p-8 max-h-[70vh] overflow-y-auto space-y-12">
               {/* Table Logic (Regular) */}
               <div>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Regular Fit (5 Sizes)</p>
                 <div className="grid grid-cols-3 bg-white text-black font-black p-4 text-[10px] uppercase rounded-t-2xl">
                   <span>Size</span><span>Width</span><span>Length</span>
                 </div>
                 {[ ['S', 52, 68], ['M', 54, 70], ['L', 56, 72], ['XL', 58, 74], ['2XL', 60, 76] ].map(row => (
                   <div key={row[0]} className="grid grid-cols-3 p-4 border-b border-white/5 text-zinc-400 text-sm">
                      <span>{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span>
                   </div>
                 ))}
               </div>
               {/* Table Logic (Oversized) */}
               <div>
                 <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4">Oversized Fit (4 Sizes)</p>
                 <div className="grid grid-cols-3 bg-cyan-400 text-black font-black p-4 text-[10px] uppercase rounded-t-2xl">
                   <span>Size</span><span>Width</span><span>Length</span>
                 </div>
                 {[ ['S', 54, 72.5], ['M', 57, 73.5], ['L', 60, 74.5], ['XL', 63, 76.5] ].map(row => (
                   <div key={row[0]} className="grid grid-cols-3 p-4 border-b border-white/5 text-zinc-400 text-sm">
                      <span>{row[0]}</span><span>{row[1]}</span><span>{row[2]}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
