'use client'

import { useEffect, useRef, useState } from 'react'
import {
  DrawingUtils,
  FilesetResolver,
  PoseLandmarker,
} from '@mediapipe/tasks-vision'

interface TryOnProps {
  itemUrl: string
  selectedSize?: string
  productName?: string
}

const SIZE_SCALE: Record<string, number> = {
  S: 0.9,
  M: 1,
  L: 1.08,
  XL: 1.16,
  '2XL': 1.24,
}

export default function TryOnEngine({
  itemUrl,
  selectedSize = 'L',
  productName = 'Sway Maverick Item',
}: TryOnProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const poseLandmarkerRef = useRef<PoseLandmarker | null>(null)
  const garmentImageRef = useRef<HTMLImageElement | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const [isLoading, setIsLoading] = useState(true)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [isCameraReady, setIsCameraReady] = useState(false)
  const [poseDetected, setPoseDetected] = useState(false)

  useEffect(() => {
    let isMounted = true

    const start = async () => {
      try {
        setIsLoading(true)
        setCameraError(null)
        setPoseDetected(false)

        // 🔹 Load Mediapipe
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

        poseLandmarkerRef.current = pose

        // 🔹 Load garment image
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.src = itemUrl

        await new Promise((res, rej) => {
          img.onload = res
          img.onerror = () => rej('Image failed to load')
        })

        garmentImageRef.current = img

        // 🔹 Camera
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
        })

        streamRef.current = stream

        if (!videoRef.current) return

        videoRef.current.srcObject = stream

        // ⚡ FIX play() error
        await videoRef.current.play().catch(() => {})

        if (!isMounted) return

        setIsCameraReady(true)
        setIsLoading(false)

        loop()
      } catch (err: any) {
        setCameraError(
          err?.message || 'Camera error. Allow permission or use HTTPS.'
        )
        setIsLoading(false)
      }
    }

    const loop = () => {
      const video = videoRef.current
      const canvas = canvasRef.current
      const pose = poseLandmarkerRef.current
      const img = garmentImageRef.current

      if (!video || !canvas || !pose || !img) {
        animationFrameRef.current = requestAnimationFrame(loop)
        return
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      const w = video.videoWidth
      const h = video.videoHeight

      if (!w || !h) {
        animationFrameRef.current = requestAnimationFrame(loop)
        return
      }

      canvas.width = w
      canvas.height = h

      ctx.clearRect(0, 0, w, h)

      // mirror
      ctx.save()
      ctx.translate(w, 0)
      ctx.scale(-1, 1)

      ctx.drawImage(video, 0, 0, w, h)

      const results = pose.detectForVideo(video, performance.now())

      if (results.landmarks?.length) {
        const lm = results.landmarks[0]

        const leftShoulder = lm[11]
        const rightShoulder = lm[12]
        const leftHip = lm[23]
        const rightHip = lm[24]

        if (leftShoulder && rightShoulder && leftHip && rightHip) {
          setPoseDetected(true)

          const lsx = leftShoulder.x * w
          const lsy = leftShoulder.y * h
          const rsx = rightShoulder.x * w
          const rsy = rightShoulder.y * h

          const hipY =
            ((leftHip.y * h + rightHip.y * h) / 2)

          const shoulderWidth = Math.abs(rsx - lsx)
          const torsoHeight = Math.abs(hipY - (lsy + rsy) / 2)

          const angle = Math.atan2(rsy - lsy, rsx - lsx)
          const scale = SIZE_SCALE[selectedSize] || 1

          const gw = shoulderWidth * 2.1 * scale
          const gh = torsoHeight * 2.4 * scale

          ctx.save()
          ctx.translate((lsx + rsx) / 2, (lsy + rsy) / 2 + torsoHeight * 0.2)
          ctx.rotate(-angle)

          ctx.drawImage(img, -gw / 2, -gh / 3, gw, gh)

          ctx.restore()
        } else {
          setPoseDetected(false)
        }
      }

      ctx.restore()

      animationFrameRef.current = requestAnimationFrame(loop)
    }

    start()

    return () => {
      isMounted = false

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close()
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [itemUrl, selectedSize])

  return (
    <div className="w-full mt-6">
      <div className="bg-zinc-950 rounded-[30px] border border-white/10 p-6">
        <div className="flex justify-between mb-4">
          <p className="text-xs text-zinc-400">Live AI Fitting</p>
          <span className="text-cyan-400 font-bold">{selectedSize}</span>
        </div>

        {isLoading && (
          <p className="text-cyan-400 text-xs mb-3">Starting camera...</p>
        )}

        {cameraError && (
          <p className="text-red-400 text-xs mb-3">{cameraError}</p>
        )}

        {!poseDetected && isCameraReady && (
          <p className="text-yellow-400 text-xs mb-3">
            Show shoulders clearly
          </p>
        )}

        <div className="relative w-full aspect-[3/4] bg-black rounded-xl overflow-hidden">
          <video ref={videoRef} autoPlay muted playsInline className="hidden" />
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>
      </div>
    </div>
  )
}
