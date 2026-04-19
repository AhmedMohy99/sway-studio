'use client'
import { useState } from 'react'

interface TryOnProps {
  itemUrl: string;
  selectedSize: string;
}

export default function TryOnEngine({ itemUrl, selectedSize }: TryOnProps) {
  const [userImage, setUserImage] = useState<string | null>(null)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<boolean>(false)

  // Handle the image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUserImage(URL.createObjectURL(file))
    }
  }

  // Simulate the AI processing the image and size
  const handleGenerate = () => {
    if (!userImage || !height || !weight) return alert("Please upload a photo and enter your dimensions.")
    
    setIsProcessing(true)
    // Here is where you would call a real AI API like Replicate.
    // For now, we simulate a 3-second AI loading process.
    setTimeout(() => {
      setIsProcessing(false)
      setResult(true)
    }, 3000)
  }

  return (
    <div className="w-full bg-zinc-950 border border-white/10 rounded-[30px] p-6 mt-6">
      
      {!result ? (
        <>
          {/* 1. UPLOAD SECTION */}
          <div className="mb-6">
            <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-3">1. Target Subject</p>
            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-400/5 transition-all">
              {userImage ? (
                <img src={userImage} className="w-full h-full object-cover rounded-xl opacity-50" alt="User upload" />
              ) : (
                <div className="text-center">
                  <span className="text-2xl mb-2 block">📷</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Upload Photo</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* 2. BODY DIMENSIONS SECTION */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-2">Height (CM)</p>
              <input 
                type="number" 
                placeholder="e.g. 180" 
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm font-black text-center focus:border-cyan-400 outline-none"
              />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-2">Weight (KG)</p>
              <input 
                type="number" 
                placeholder="e.g. 75" 
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm font-black text-center focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          {/* 3. SIZE CONFIRMATION */}
          <div className="mb-8 p-4 bg-white/5 rounded-xl text-center border border-white/10">
            <p className="text-[9px] uppercase tracking-[0.3em] text-zinc-400 mb-1">Target Fit Calibration</p>
            <p className="text-sm font-black text-cyan-400">Rendering as Size: <span className="text-white text-xl">{selectedSize}</span></p>
          </div>

          {/* 4. LAUNCH BUTTON */}
          <button 
            onClick={handleGenerate}
            disabled={isProcessing}
            className={`w-full py-5 rounded-full text-[11px] font-[1000] uppercase tracking-widest transition-all ${
              isProcessing ? 'bg-zinc-800 text-cyan-400 animate-pulse' : 'bg-cyan-400 text-black hover:bg-white'
            }`}
          >
            {isProcessing ? 'Calibrating Neural Net...' : 'Generate AI Fitting'}
          </button>
        </>
      ) : (
        /* RESULT SCREEN */
        <div className="text-center py-10">
          <h3 className="text-2xl font-[1000] italic text-cyan-400 mb-4 uppercase">Fitting Complete</h3>
          <p className="text-xs text-zinc-400 tracking-widest mb-6">
            Size {selectedSize} mapped to {height}cm / {weight}kg.
          </p>
          <div className="relative w-full aspect-[3/4] bg-zinc-900 rounded-2xl overflow-hidden border border-cyan-400/50 shadow-[0_0_30px_rgba(0,245,255,0.2)]">
            {/* In a real app, this img src would be the URL returned by the AI. For now, we show a success placeholder. */}
            <img src={itemUrl} className="w-full h-full object-cover opacity-80 mix-blend-screen" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                <p className="text-[10px] font-black tracking-widest uppercase text-cyan-400 border border-cyan-400 px-4 py-2 rounded-full">
                  [ AI API Backend Required for Live Render ]
                </p>
            </div>
          </div>
          <button onClick={() => setResult(false)} className="mt-8 text-[10px] font-black tracking-widest text-zinc-500 uppercase hover:text-white">← Recalibrate</button>
        </div>
      )}
    </div>
  )
}
