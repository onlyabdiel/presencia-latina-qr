import { useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader } from '@zxing/browser';

interface Props {
  onScan: (text: string) => void;
}

export function QrReader({ onScan }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const readerRef = useRef<BrowserQRCodeReader | null>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const reader = new BrowserQRCodeReader();
    readerRef.current = reader;

    BrowserQRCodeReader.listVideoInputDevices()
      .then((devices) => {
        const deviceId = devices.find((d) =>
          d.label.toLowerCase().includes('back') ||
          d.label.toLowerCase().includes('rear') ||
          d.label.toLowerCase().includes('environment')
        )?.deviceId ?? devices[0]?.deviceId;

        if (!videoRef.current) return;

        return reader.decodeFromVideoDevice(deviceId, videoRef.current, (result, err, controls) => {
          controlsRef.current = controls;
          if (result) {
            controls.stop();
            onScan(result.getText());
          }
          if (err && !(err instanceof Error && err.name === 'NotFoundException')) {
            console.error(err);
          }
        });
      })
      .catch((err) => {
        if (err instanceof Error && err.name === 'NotAllowedError') {
          setError('Permiso de cámara denegado. Habilita el acceso en tu navegador.');
        } else {
          setError('No se pudo acceder a la cámara.');
        }
      });

    return () => {
      controlsRef.current?.stop();
    };
  }, [onScan]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
        <span className="text-5xl">📷</span>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <video
      ref={videoRef}
      className="w-full h-full object-cover"
      autoPlay
      muted
      playsInline
    />
  );
}
