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

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [poseDetected, setPoseDetected] = useState(false)

  // Keep size ref in sync
  useEffect(() => {
    selectedSizeRef.current = selectedSize
  }, [selectedSize])

  // Image loader logic
  useEffect(() => {
    if (!itemUrl) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = itemUrl
    img.onload = () => {
      imageRef.current = img
    }
  }, [itemUrl])

  useEffect(() => {
    mountedRef.current = true

    const init = async () => {
      try {
        setLoading(true)
        setError(null)

        if (
          typeof window !== 'undefined' &&
          location.protocol !== 'https:' &&
          location.hostname !== 'localhost'
        ) {
          throw new Error('Camera requires HTTPS or localhost')
        }

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

        // Start camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
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
        
        await new Promise((resolve) => {
          video.onloadedmetadata = () => resolve(true)
        })

        try {
          await video.play()
        } catch (playErr: any) {
          if (playErr?.name !== 'AbortError') throw playErr
        }

        setLoading(false)
        renderLoop()
      } catch (e: any) {
        if (mountedRef.current) {
          setError(e?.message ?? 'Camera error. Please allow access.')
          setLoading(false)
        }
      }
    }

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
      canvas.width = w
      canvas.height = h

      // 1. Mirroring logic for the background video
      ctx.save()
      ctx.scale(-1, 1)
      ctx.translate(-w, 0)
      ctx.drawImage(video, 0, 0, w, h)
      ctx.restore()

      const res = pose.detectForVideo(video, performance.now())

      if (res.landmarks && res.landmarks.length > 0) {
        const lm = res.landmarks[0]
        const ls = lm[11] // Left shoulder
        const rs = lm[12] // Right shoulder
        const lh = lm[23] // Left hip
        const rh = lm[24] // Right hip

        if (ls && rs && lh && rh && ls.visibility > 0.5 && rs.visibility > 0.5) {
          // Use functional update to avoid stale closures and unnecessary re-renders
          setPoseDetected(prev => prev ? prev : true)

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
          
          // Fix rotation: MediaPipe coords are flipped for the user, 
          // but we draw on a mirrored canvas.
          const angle = Math.atan2(rsy - lsy, rsx - lsx)

          const gw = shoulderW * 2.2 * scale
          const gh = torsoH * 2.6 * scale

          ctx.save()
          // Mirror the drawing context for the T-shirt to match the mirrored video
          ctx.translate(w, 0)
          ctx.scale(-1, 1)
          
          // Translate to the calculated center (mapped to mirrored space)
          ctx.translate(cx, cy + (torsoH * 0.15))
          ctx.rotate(angle)
          
          ctx.drawImage(img, -gw / 2, -gh / 3.5, gw, gh)
          ctx.restore()
        } else {
          setPoseDetected(prev => prev ? false : prev)
        }
      } else {
        setPoseDetected(prev => prev ? false : prev)
      }

      animFrameRef.current = requestAnimationFrame(renderLoop)
    }

    init()

    return () => {
      mountedRef.current = false
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      if (poseRef.current) poseRef.current.close()
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
    }
  }, [])

  return (
    <div className="mt-4">
      {loading && (
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
          <p className="text-cyan-400 text-[11px] font-bold uppercase tracking-widest">
            Starting camera…
          </p>
        </div>
      )}

      {error && (
        <div className="mb-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-red-400 text-[11px] font-bold uppercase tracking-wide">{error}</p>
        </div>
      )}

      {!loading && !error && !poseDetected && (
        <div className="mb-3 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 px-4 py-3">
          <p className="text-yellow-300 text-[11px] font-bold uppercase tracking-wide">
            Step back · Show shoulders clearly
          </p>
        </div>
      )}

      <div className="relative w-full aspect-[3/4] bg-zinc-950 rounded-2xl overflow-hidden border border-white/10">
        <video ref={videoRef} autoPlay playsInline muted className="hidden" />
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>
    </div>
  )
}
