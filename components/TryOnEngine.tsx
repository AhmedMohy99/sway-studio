'use client'
import { useState, useRef, useEffect } from 'react'

interface TryOnProps {
  itemUrl: string;
  selectedSize?: string;
}

export default function TryOnEngine({ itemUrl, selectedSize = "L" }: TryOnProps) {
  const [step, setStep] = useState<'capture' | 'metrics' | 'processing' | 'result'>('capture')
  const [userImage, setUserImage] = useState<string | null>(null)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  
  // Camera Refs
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  // Cleanup camera when component unmounts
  useEffect(() => {
    return () => stopCamera()
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (err) {
      alert("Camera access denied or unavailable. Please use the upload option.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
    }
  }

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageDataUrl = canvas.toDataURL('image/jpeg')
        setUserImage(imageDataUrl)
        stopCamera()
        setStep('metrics') // Move to next step
      }
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUserImage(URL.createObjectURL(file))
      setStep('metrics')
    }
  }

  const handleGenerate = () => {
    if (!height || !weight) return alert("Please enter height and weight for accurate sizing.")
    setStep('processing')
    
    // Simulate AI Processing time (4 seconds)
    setTimeout(() => {
      setStep('result')
    }, 4000)
  }

  return (
    <div className="w-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 mt-6 overflow-hidden relative">
      
      {/* STEP 1: CAPTURE PHOTO */}
      {step === 'capture' && (
        <div className="flex flex-col items-center">
          <p className="text-[10px] font-black uppercase text-cyan-400 tracking-[0.3em] mb-4">1. Subject Capture</p>
          
          <div className="relative w-full aspect-[3/4] bg-black rounded-2xl overflow-hidden border-2 border-dashed border-white/20 mb-6 flex items-center justify-center">
            {isCameraActive ? (
              <>
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover transform -scale-x-100" />
                <button onClick={takePhoto} className="absolute bottom-6 w-16 h-16 bg-white rounded-full border-4 border-cyan-400 shadow-[0_0_20px_rgba(0,245,255,0.5)] transition-transform hover:scale-95 active:scale-90" />
              </>
            ) : (
              <div className="text-center p-6">
                <p className="text-zinc-500 text-xs mb-4 uppercase tracking-widest font-bold">Stand in good lighting</p>
                <button onClick={startCamera} className="bg-cyan-400 text-black px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors mb-4 w-full">
                  Open Camera
                </button>
                <p className="text-zinc-600 text-[10px] uppercase font-bold mb-4">OR</p>
                <label className="border border-white/20 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer hover:border-white transition-colors w-full block">
                  Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            )}
          </div>
          
          {/* Hidden Canvas for capturing video frame */}
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* STEP 2: BODY METRICS */}
      {step === 'metrics' && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] font-black uppercase text-cyan-400 tracking-[0.3em]">2. Body Calibration</p>
            <button onClick={() => { setStep('capture'); setUserImage(null); }} className="text-[9px] uppercase tracking-widest text-zinc-500 hover:text-white font-bold">Retake Photo</button>
          </div>
          
          <div className="flex gap-4 mb-8">
            {userImage && <img src={userImage} className="w-20 h-24 object-cover rounded-xl border border-white/20" alt="User" />}
            <div className="flex flex-col justify-center">
              <p className="text-xs font-bold text-white mb-1 uppercase tracking-wider">Target Acquired</p>
              <p className="text-[10px] text-zinc-500 tracking-widest">Ready for dimensions</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-2">Height (CM)</p>
              <input type="number" placeholder="180" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-lg font-black text-center focus:border-cyan-400 outline-none" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.3em] mb-2">Weight (KG)</p>
              <input type="number" placeholder="75" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-lg font-black text-center focus:border-cyan-400 outline-none" />
            </div>
          </div>

          <button onClick={handleGenerate} className="w-full bg-cyan-400 text-black py-5 rounded-full text-xs font-[1000] uppercase tracking-widest hover:bg-white transition-colors shadow-[0_0_20px_rgba(0,245,255,0.3)]">
            Initialize AI Engine
          </button>
        </div>
      )}

      {/* STEP 3: PROCESSING ANIMATION */}
      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-zinc-800 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
          </div>
          <h3 className="text-xl font-[1000] italic text-cyan-400 uppercase tracking-tighter mb-2 animate-pulse">Mapping Silhouette...</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.3em]">Applying Size {selectedSize}</p>
        </div>
      )}

      {/* STEP 4: RESULT */}
      {step === 'result' && (
        <div className="animate-fade-in text-center">
          <h3 className="text-2xl font-[1000] italic text-cyan-400 mb-2 uppercase tracking-tighter">Fitting Complete</h3>
          <p className="text-[10px] text-zinc-400 tracking-widest mb-6 uppercase font-bold">Size {selectedSize} • {height}cm • {weight}kg</p>
          
          <div className="relative w-full aspect-[3/4] bg-zinc-900 rounded-[30px] overflow-hidden border border-cyan-400/30 shadow-[0_0_30px_rgba(0,245,255,0.15)]">
            {/* The base user image */}
            {userImage && <img src={userImage} className="absolute inset-0 w-full h-full object-cover opacity-50 grayscale" alt="Base" />}
            
            {/* The product image overlaid */}
            <img src={itemUrl} className="absolute inset-0 w-full h-full object-contain scale-110 mix-blend-screen drop-shadow-2xl" alt="Product" />
            
            <div className="absolute top-4 right-4 bg-black/80 backdrop-blur border border-cyan-400 text-cyan-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
              AI Mockup
            </div>
          </div>
          
          <button onClick={() => setStep('capture')} className="mt-8 text-[10px] font-black tracking-widest text-zinc-500 uppercase hover:text-white border border-white/10 px-6 py-3 rounded-full">
            Recalibrate
          </button>
        </div>
      )}
    </div>
  )
}
