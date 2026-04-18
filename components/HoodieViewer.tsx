'use client'
export default function HoodieViewer({ modelUrl }: { modelUrl: string }) {
  return (
    <div className="w-full h-full flex items-center justify-center bg-zinc-900 rounded-[40px] border border-white/5">
      <div className="text-center">
        <div className="w-20 h-20 bg-cyan-400/20 rounded-full blur-xl mx-auto mb-4 animate-pulse" />
        <p className="text-[10px] uppercase tracking-[0.5em] text-cyan-400">3D Studio Loading</p>
      </div>
    </div>
  )
}
