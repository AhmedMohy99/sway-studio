'use client'
import { useState, useRef, useEffect } from 'react'

interface TryOnProps {
  itemUrl: string;
  selectedSize?: string;
}

export default function TryOnEngine({ itemUrl, selectedSize = "L" }: TryOnProps) {
  const [step, setStep] = useState<'capture' | 'metrics' | 'processing' | 'result'>('capture')
  const [userImage, setUserImage] = useState<string | null>(null)
  const [finalAiImage, setFinalAiImage] = useState<string | null>(null)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isCameraActive, setIsCameraActive] = useState(false)

  useEffect(() => { return () => stopCamera() }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraActive(true)
      }
    } catch (err) { alert("Camera access denied. Please use the upload option.") }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream
      stream.getTracks().forEach(track => track.stop())
      videoRef.current.srcObject = null
      setIsCameraActive(false)
    }
  }

  // FIX 1: Format Camera Photo as compressed Base64 Data
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const context = canvas.getContext('2d')
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        // Use 0.8 quality to prevent the file from being too large for the server
        const base64Data = canvas.toDataURL('image/jpeg', 0.8) 
        setUserImage(base64Data)
        stopCamera()
        setStep('metrics')
      }
    }
  }

  // FIX 2: Format Uploaded Photo as Base64 Data instead of local Blob
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        // This converts the image to a raw data string the AI can read
        setUserImage(reader.result as string)
        setStep('metrics')
      }
      reader.readAsDataURL(file)
    }
  }

  const handleGenerate = async () => {
    if (!height || !weight || !userImage) return alert("Missing data.")
    setStep('processing')
    
    try {
      const response = await fetch('/api/tryon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userImage: userImage, // Now properly formatted as Base64
          garmentImage: itemUrl
        })
      })

      const data = await response.json()

      if (data.resultUrl) {
        setFinalAiImage(data.resultUrl)
        setStep('result')
      } else {
        alert("AI Engine failed to map the garment. Please try a clearer photo.")
        setStep('capture')
      }
    } catch (error) {
      alert("Network Error with AI Engine.")
      setStep('capture')
    }
  }

  return (
    <div className="w-full bg-zinc-950/80 backdrop-blur-xl border border-white/10 rounded-[30px] p-6 mt-6 overflow-hidden relative">
      
      {/* CAPTURE STEP */}
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
                <button onClick={startCamera} className="bg-cyan-400 text-black px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-white mb-4 w-full">Open Camera</button>
                <p className="text-zinc-600 text-[10px] uppercase font-bold mb-4">OR</p>
                <label className="border border-white/20 text-white px-8 py-4 rounded-full text-[10px] font-black uppercase tracking-widest cursor-pointer w-full block">
                  Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            )}
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      {/* METRICS STEP */}
      {step === 'metrics' && (
        <div className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <p className="text-[10px] font-black uppercase text-cyan-400 tracking-[0.3em]">2. Body Calibration</p>
            <button onClick={() => { setStep('capture'); setUserImage(null); }} className="text-[9px] uppercase tracking-widest text-zinc-500 hover:text-white font-bold">Retake</button>
          </div>
          <div className="flex gap-4 mb-8">
            {userImage && <img src={userImage} className="w-20 h-24 object-cover rounded-xl border border-white/20" alt="User" /> }
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div><input type="number" placeholder="Height (cm)" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm focus:border-cyan-400 outline-none" /></div>
            <div><input type="number" placeholder="Weight (kg)" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-white text-sm focus:border-cyan-400 outline-none" /></div>
          </div>
          <button onClick={handleGenerate} className="w-full bg-cyan-400 text-black py-5 rounded-full text-xs font-[1000] uppercase tracking-widest shadow-[0_0_20px_rgba(0,245,255,0.3)]">
            Initialize AI Engine
          </button>
        </div>
      )}

      {/* PROCESSING STEP */}
      {step === 'processing' && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="relative w-32 h-32 mb-8 animate-pulse">
            <div className="absolute inset-0 border-t-4 border-cyan-400 rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-[1000] italic text-cyan-400 uppercase tracking-tighter animate-pulse">Running Neural Net...</h3>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Connecting to AI Server...</p>
        </div>
      )}

      {/* RESULT STEP */}
      {step === 'result' && (
        <div className="animate-fade-in text-center">
          <h3 className="text-2xl font-[1000] italic text-cyan-400 mb-2 uppercase">Fitting Complete</h3>
          <div className="relative w-full aspect-[3/4] bg-zinc-900 rounded-[30px] overflow-hidden border border-cyan-400/50 shadow-[0_0_30px_rgba(0,245,255,0.2)]">
            {finalAiImage && <img src={finalAiImage} className="w-full h-full object-cover" alt="AI Fitted Result" />}
          </div>
          <button onClick={() => setStep('capture')} className="mt-8 text-[10px] font-black tracking-widest text-zinc-500 uppercase hover:text-white border border-white/10 px-6 py-3 rounded-full">
            Try Another Fit
          </button>
        </div>
      )}
    </div>
  )
}
