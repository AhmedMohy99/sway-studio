'use client'
import React, { useRef, useState, useEffect } from 'react';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';

export default function TryOnEngine({ itemUrl }: { itemUrl: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [detector, setDetector] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const model = poseDetection.SupportedModels.MoveNet;
      setDetector(await poseDetection.createDetector(model));
    };
    load();
  }, []);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = stream;
  };

  return (
    <div className="relative w-full aspect-[3/4] bg-black rounded-[40px] overflow-hidden border border-white/10">
      <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-50" />
      <div className="absolute inset-0 flex items-center justify-center">
        <button onClick={start} className="bg-white text-black px-8 py-3 rounded-full text-[10px] font-bold uppercase tracking-widest">
          Open Camera
        </button>
      </div>
    </div>
  );
}
