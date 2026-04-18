'use client'
import { useState } from 'react'
import TryOnEngine from '@/components/TryOnEngine'
import HoodieViewer from '@/components/HoodieViewer'
import SizeGuide from '@/components/SizeGuide'

export default function Home() {
  const [mode, setMode] = useState<'3d' | 'try'>('3d')
  const [showGuide, setShowGuide] = useState(false)

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      {/* 1. Brand Header */}
      <nav className="p-8 flex justify-between items-center fixed top-0 w-full z-50">
        <div className="flex flex-col">
          <h1 className="text-2xl font-black italic tracking-tighter text-swayCyan shadow-swayCyan">SWAY</h1>
          <span className="text-[8px] tracking-[0.5em] text-zinc-500 uppercase">Crafted for the Maverick</span>
        </div>
        <button 
          onClick={() => setShowGuide(true)}
          className="text-[10px] uppercase tracking-widest border border-white/10 px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
        >
          Size Protocol
        </button>
      </nav>

      {/* 2. Central Viewer */}
      <div className="h-screen flex flex-col items-center justify-center relative">
        <div className="w-full max-w-4xl aspect-square relative">
          {mode === '3d' ? (
             <HoodieViewer modelUrl="/hoodie.glb" />
          ) : (
             <TryOnEngine itemUrl="/hoodie-flat.png" />
          )}
          
          {/* Cyan Glow Effect */}
          <div className="absolute inset-0 bg-swayCyan/5 blur-[120px] rounded-full -z-10" />
        </div>

        {/* 3. Mode Switcher (The Zara/Bershka floating pill) */}
        <div className="absolute bottom-12 flex gap-2 bg-zinc-900/80 backdrop-blur-xl p-1.5 rounded-full border border-white/5">
          <button 
            onClick={() => setMode('3d')}
            className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === '3d' ? 'bg-swayCyan text-black' : 'text-zinc-500'}`}
          >
            3D View
          </button>
          <button 
            onClick={() => setMode('try')}
            className={`px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${mode === 'try' ? 'bg-swayCyan text-black' : 'text-zinc-500'}`}
          >
            Virtual Fit
          </button>
        </div>
      </div>

      <SizeGuide isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </main>
  )
}
