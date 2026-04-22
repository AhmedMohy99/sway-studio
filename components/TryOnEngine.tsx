'use client'

import { useEffect, useRef, useState } from 'react'
import { FilesetResolver, PoseLandmarker } from '@mediapipe/tasks-vision'

interface TryOnProps {
  itemUrl: string
  selectedSize?: string
  productName?: string
}

const SIZE_SCALE: Record<string, number> = {
  S: 0.88,
  M: 0.96,
  L: 1.04,
  XL: 1.13,
  '2XL': 1.22,
}

export default function TryOnEngine({
  itemUrl,
  selectedSize = 'L',
  productName,
}: TryOnProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const poseRef = useRef<PoseLandmarker | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const selectedSizeRef = useRef(selectedSize)
  const animFrameRef = useRef<number | null>(null)
  const mountedRef = useRef(true)
  const initStartedRef = useRef(false)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [poseDetected, setPoseDetected] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)
  const [mediapipeReady, setMediapipeReady] = useState(false)

  // Keep size ref in sync
  useEffect(() => {
    selectedSizeRef.current = selectedSize
  }, [selectedSize])

  // Preload garment image
  useEffect(() => {
    if (!itemUrl) return
    
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = itemUrl
    
    img.onload = () => {
      imageRef.current = img
      console.log('✓ Garment image loaded:', itemUrl)
    }
    
    img.onerror = () => {
      console.error('✗ Failed to load garment image:', itemUrl)
      setError('Failed to load garment image')
    }

    return () => {
      img.onload = null
      img.onerror = null
    }
  }, [itemUrl])

  useEffect(() => {
    mountedRef.current = true
    
    // Prevent double initialization
    if (initStartedRef.current) return
    initStartedRef.current = true

    const initCamera = async () => {
      try {
        // Security check
        if (
          typeof window !== 'undefined' &&
          location.protocol !== 'https:' &&
          location.hostname !== 'localhost'
        ) {
          throw new Error('Camera requires HTTPS or localhost')
        }

        console.log('Starting camera...')

        // Request camera first (faster user feedback)
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            facingMode: 'user', 
            width: { ideal: 1280 }, 
            height: { ideal: 720 } 
          },
          audio: false,
        })

        if (!mountedRef.current) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }

        streamRef.current = stream
        const video = videoRef.current
        if (!video) return

        video.srcObject = stream

        // Wait for video metadata
        await new Promise<void>((resolve) => {
          video.onloadedmetadata = () => {
            console.log('✓ Video metadata loaded')
            resolve()
          }
        })

        // Start playback
        try {
          await video.play()
          console.log('✓ Video playing')
          setCameraReady(true)
        } catch (playErr: any) {
          if (playErr?.name !== 'AbortError') {
            throw playErr
          }
        }

      } catch (e: any) {
        console.error('Camera error:', e)
        if (mountedRef.current) {
          setError(e?.message ?? 'Camera access denied. Please allow camera permissions.')
          setLoading(false)
        }
      }
    }

    const initMediaPipe = async () => {
      try {
        console.log('Loading MediaPipe...')

        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )

        const pose = await PoseLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/latest/pose_landmarker_lite.task',
          },
          runningMode: 'VIDEO',
          numPoses: 1,
        })

        if (!mountedRef.current) {
          pose.close()
          return
        }

        poseRef.current = pose
        console.log('✓ MediaPipe loaded')
        setMediapipeReady(true)

      } catch (e: any) {
        console.error('MediaPipe error:', e)
        if (mountedRef.current) {
          setError('Failed to load AI engine. Please refresh.')
          setLoading(false)
        }
      }
    }

    // Initialize both in parallel
    Promise.all([initCamera(), initMediaPipe()]).then(() => {
      if (mountedRef.current) {
        setLoading(false)
      }
    })

    return () => {
      mountedRef.current = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (poseRef.current) {
        poseRef.current.close()
        poseRef.current = null
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
        streamRef.current = null
      }
    }
  }, [])

  // Start render loop when both camera and MediaPipe are ready
  useEffect(() => {
    if (!cameraReady || !mediapipeReady || !mountedRef.current) return

    console.log('✓ Starting render loop')

    const renderLoop = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      const pose = poseRef.current
      const img = imageRef.current

      if (!mountedRef.current) return

      if (!video || !canvas || !pose || !img || video.readyState < 2) {
        animFrameRef.current = requestAnimationFrame(renderLoop)
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const w = video.videoWidth
      const h = video.videoHeight
      
      if (w === 0 || h === 0) {
        animFrameRef.current = requestAnimationFrame(renderLoop)
        return
      }

      canvas.width = w
      canvas.height = h

      // Mirror the background video feed
      ctx.save()
      ctx.scale(-1, 1)
      ctx.translate(-w, 0)
      ctx.drawImage(video, 0, 0, w, h)
      ctx.restore()

      // Detect pose
      const res = pose.detectForVideo(video, performance.now())

      if (res.landmarks && res.landmarks.length > 0) {
        const lm = res.landmarks[0]
        const ls = lm[11] // Left shoulder
        const rs = lm[12] // Right shoulder
        const lh = lm[23] // Left hip
        const rh = lm[24] // Right hip

        // Check visibility threshold
        if (ls && rs && lh && rh && ls.visibility > 0.5 && rs.visibility > 0.5) {
          if (!poseDetected) setPoseDetected(true)

          const scale = SIZE_SCALE[selectedSizeRef.current] ?? 1.0

          // Calculate coordinates
          const lsx = ls.x * w
          const lsy = ls.y * h
          const rsx = rs.x * w
          const rsy = rs.y * h
          const hipY = ((lh.y + rh.y) / 2) * h

          const cx = (lsx + rsx) / 2
          const cy = (lsy + rsy) / 2

          const shoulderW = Math.sqrt(Math.pow(rsx - lsx, 2) + Math.pow(rsy - lsy, 2))
          const torsoH = Math.abs(hipY - cy)
          
          // Calculate rotation angle (for mirrored canvas)
          const angle = Math.atan2(rsy - lsy, rsx - lsx)

          const gw = shoulderW * 2.2 * scale
          const gh = torsoH * 2.6 * scale

          // Draw garment with mirroring
          ctx.save()
          ctx.translate(w, 0)
          ctx.scale(-1, 1)
          ctx.translate(cx, cy + (torsoH * 0.15))
          ctx.rotate(angle)
          ctx.drawImage(img, -gw / 2, -gh / 3.5, gw, gh)
          ctx.restore()
        } else {
          if (poseDetected) setPoseDetected(false)
        }
      } else {
        if (poseDetected) setPoseDetected(false)
      }

      animFrameRef.current = requestAnimationFrame(renderLoop)
    }

    renderLoop()

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current)
        animFrameRef.current = null
      }
    }
  }, [cameraReady, mediapipeReady, poseDetected])

  return (
    <div className="w-full h-full flex flex-col">
      {loading && (
        <div className="flex items-center gap-2 mb-3 px-4">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <p className="text-cyan-400 text-[11px] font-bold uppercase tracking-widest">
            {!cameraReady && !mediapipeReady && 'Initializing AI Studio...'}
            {cameraReady && !mediapipeReady && 'Loading AI Engine...'}
            {!cameraReady && mediapipeReady && 'Starting Camera...'}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-3 mx-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-red-400 text-[11px] font-bold uppercase tracking-wide">{error}</p>
        </div>
      )}

      {!loading && !error && !poseDetected && (
        <div className="mb-3 mx-4 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
          <p className="text-yellow-300 text-[11px] font-bold uppercase tracking-wide">
            Step back · Show shoulders clearly
          </p>
        </div>
      )}

      {!loading && !error && poseDetected && (
        <div className="mb-3 mx-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3">
          <p className="text-green-300 text-[11px] font-bold uppercase tracking-wide">
            ✓ Perfect fit detected
          </p>
        </div>
      )}

      <div className="relative w-full flex-1 bg-zinc-950 rounded-2xl overflow-hidden border border-white/10">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          muted 
          className="hidden" 
        />
        <canvas 
          ref={canvasRef} 
          className="w-full h-full object-cover" 
        />
      </div>
    </div>
  )
}
