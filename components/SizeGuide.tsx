'use client'
import { useState } from 'react'

export default function SizeGuide({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'hoodie' | 'pants'>('hoodie')

  if (!isOpen) return null;

  const hoodieData = [
    { s: '1', w: '56', l: '66' },
    { s: '2', w: '59', l: '68' },
    { s: '3', w: '63', l: '70' },
    { s: '4', w: '65', l: '72' },
    { s: '5', w: '69', l: '75' },
  ]

  const pantsData = [
    { s: '1', w: '34', l: '100' },
    { s: '2', w: '36', l: '101' },
    { s: '3', w: '38', l: '102' },
    { s: '4', w: '40', l: '104' },
  ]

  const currentData = activeTab === 'hoodie' ? hoodieData : pantsData

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 p-10 rounded-[40px] relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-500 hover:text-white font-black uppercase text-[10px] tracking-widest">Close ✕</button>
        
        <h2 className="text-3xl font-[1000] italic tracking-tighter mb-8 uppercase text-cyan-400">Sizing Protocol</h2>
        
        {/* Toggle between Hoodie and Pants */}
        <div className="flex gap-4 mb-10 border-b border-white/5">
          <button 
            onClick={() => setActiveTab('hoodie')}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'hoodie' ? 'text-white border-b-2 border-white' : 'text-zinc-600'}`}
          >
            Oversized Hoodies
          </button>
          <button 
            onClick={() => setActiveTab('pants')}
            className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'pants' ? 'text-white border-b-2 border-white' : 'text-zinc-600'}`}
          >
            Wide Leg Sweatpants
          </button>
        </div>

        {/* Table Head */}
        <div className="grid grid-cols-3 pb-4 border-b border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
          <span>Size</span>
          <span>Width (cm)</span>
          <span>Length (cm)</span>
        </div>

        {/* Table Body */}
        <div className="mt-4 space-y-2">
          {currentData.map((item) => (
            <div key={item.s} className="grid grid-cols-3 py-4 border-b border-white/5 items-center">
              <span className="text-cyan-400 font-black italic">Size {item.s}</span>
              <span className="font-mono text-white">{item.w} cm</span>
              <span className="font-mono text-white">{item.l} cm</span>
            </div>
          ))}
        </div>

        <p className="mt-10 text-[9px] text-zinc-600 uppercase tracking-widest leading-relaxed">
          * Measurements are taken with the garment laying flat. <br/>
          * Designed for a relaxed, maverick fit.
        </p>
      </div>
    </div>
  )
}
