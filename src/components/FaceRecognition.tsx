import React, { useRef, useEffect, useState } from 'react';
import { Camera } from 'lucide-react';

interface Props {
  onFaceDetected: (descriptor: Float32Array) => void;
  onError: (error: string) => void;
}

export const FaceRecognition: React.FC<Props> = ({ onFaceDetected, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsLoading(false);
        // For demo purposes, we'll simulate face detection
        setTimeout(() => {
          onFaceDetected(new Float32Array(128));
        }, 2000);
      } catch (error) {
        onError('Cannot access camera');
      }
    };
    startVideo();
  }, []);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {isLoading ? (
        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg">
          <Camera className="w-8 h-8 text-scarlet-600 animate-pulse" />
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          className="w-full rounded-lg shadow-lg"
        />
      )}
    </div>
  );
};