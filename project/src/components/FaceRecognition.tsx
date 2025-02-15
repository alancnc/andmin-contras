import React, { useRef, useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import * as faceapi from 'face-api.js';

interface Props {
  onFaceDetected: (descriptor: Float32Array) => void;
  onError: (error: string) => void;
  translations: any;
}

export const FaceRecognition: React.FC<Props> = ({ onFaceDetected, onError, translations: t }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        setModelsLoaded(true);
      } catch (error) {
        onError('Error loading face recognition models');
      }
    };
    loadModels();
  }, []);

  useEffect(() => {
    if (!modelsLoaded) return;

    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: 640,
            height: 480,
            facingMode: 'user'
          } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLoading(false);
      } catch (error) {
        onError(t.cannotAccessCamera);
      }
    };

    startVideo();

    return () => {
      const stream = videoRef.current?.srcObject as MediaStream;
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [modelsLoaded]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded || isLoading) return;

    const detectFace = async () => {
      if (!videoRef.current || !canvasRef.current) return;

      const detections = await faceapi
        .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detections) {
        // Draw face detection results
        const displaySize = { 
          width: videoRef.current.videoWidth, 
          height: videoRef.current.videoHeight 
        };
        faceapi.matchDimensions(canvasRef.current, displaySize);
        
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        canvasRef.current.getContext('2d')?.clearRect(
          0, 0, 
          canvasRef.current.width, 
          canvasRef.current.height
        );
        
        faceapi.draw.drawDetections(canvasRef.current, [resizedDetections]);
        faceapi.draw.drawFaceLandmarks(canvasRef.current, [resizedDetections]);

        onFaceDetected(detections.descriptor);
      }
    };

    const interval = setInterval(detectFace, 100);
    return () => clearInterval(interval);
  }, [modelsLoaded, isLoading]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
          <Camera className="w-8 h-8 text-scarlet-600 animate-pulse" />
        </div>
      ) : (
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full rounded-lg shadow-lg"
          />
          <canvas
            ref={canvasRef}
            className="absolute top-0 left-0 w-full h-full"
          />
        </div>
      )}
    </div>
  );
};