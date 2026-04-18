'use client'
import Sway3DEngine from '@/components/Sway3DEngine'
import { useState } from 'react'

export default function Home() {
  const [stats, setStats] = useState({ height: 180, width: 36 });
  const [activeItem, setActiveItem] = useState('https://www.swaymaverick.com/charcoal.jpg');

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        
        {/* TOP BAR */}
        <div className="flex justify-between items-end mb-16">
          <div>
             <h1 className="text-7xl font-black italic tracking-tighter leading-none">SWAY</h1>
             <p className="text-zinc-500 tracking-[0.5em] text-[10px] mt-2 uppercase">Urban Fossils / Fitting Room</p>
          </div>
          <div className="hidden md:block text-right">
             <p className="text-[10px] text-zinc-600 uppercase tracking-widest">Model: Rogue Relic</p>
             <p className="text-sm font-mono mt-1">V.02-2026</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* THE TRIAL (The Hero) */}
          <div className="lg:col-span-7">
            <Sway3DEngine itemUrl={activeItem} userStats={stats} />
          </div>

          {/* THE CONFIGURATION */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="mb-12">
              <h2 className="text-xs uppercase tracking-[0.4em] text-zinc-500 mb-6 border-b border-white/10 pb-4">Calibration</h2>
              <div className="space-y-8">
                <div>
                  <label className="text-[10px] uppercase text-zinc-400 block mb-2">Chest Width (cm)</label>
                  <input 
                    type="
