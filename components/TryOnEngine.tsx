'use client'
import React, { useRef, useState, useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

export default function TryOnEngine({ itemUrl }: { itemUrl: string }) {
  const [source, setSource] = useState<'camera' | 'upload' | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<any>(null);

  useEffect(() => {
    const loadAI = async () => {
      const model = poseDetection.SupportedModels.MoveNet;
      setDetector(await poseDetection.createDetector(model, { modelType: 'SINGLEPOSE_LIGHTNING' }));
    };
    loadAI();
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setSource('upload');
      processStaticImage(url);
    }
  };

  const startCamera = async () => {
    setSource('camera');
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      detectRealTime();
    }
  };

  // Logic to process an uploaded photo
  const processStaticImage = async (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = async () => {
      if (detector && canvasRef.current) {
        const poses = await detector.estimatePoses(img);
        if (poses.length > 0) drawClothing(canvasRef.current.getContext('2d')!, poses[0].keypoints, img.width, img.height);
      }
    };
  };

  const detectRealTime = async () => {
    if (detector && videoRef.current && canvasRef.current) {
      const poses = await detector.estimatePoses(videoRef.current);
      const ctx = canvasRef.current.getContext('2d');
      if (poses.length > 0 && ctx) drawClothing(ctx, poses[0].keypoints, canvasRef.current.width, canvasRef.current.height);
      if (source === 'camera') requestAnimationFrame(detectRealTime);
    }
  };

  const drawClothing = (ctx: CanvasRenderingContext2D, kp: any, w: number, h: number) => {
    const ls = kp.find((k: any) => k.name === 'left_shoulder');
    const rs = kp.find((k: any) => k.name === 'right_shoulder');
    if (ls && rs && ls.score > 0.5) {
      const cloth = new Image();
      cloth.src = itemUrl;
      const width = Math.abs(ls.x - rs.x) * 2.8;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.drawImage(cloth, (ls.x + rs.x) / 2 - width / 2, (ls.y + rs.y) / 2 - (width * 0.2), width, width * 1.1);
    }
  };

  return (
    <div className="relative w-full aspect-[3/4] bg-zinc-900 rounded-3xl overflow-hidden border border-white/10">
      {source === 'camera' && <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-50" />}
      {source === 'upload' && imageSrc && <img src={imageSrc} className="absolute inset-0 w-full h-full object-cover opacity-50" />}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {!source && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <button onClick={startCamera} className="w-full bg-white text-black py-4 rounded-full font-bold uppercase text-xs">Take Live Photo</button>
          <label className="w-full border border-white/20 py-4 rounded-full font-bold uppercase text-xs cursor-pointer">
            Upload Photo
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      )}
    </div>
  );
}
