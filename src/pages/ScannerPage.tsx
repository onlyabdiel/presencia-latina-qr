import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrReader } from '../components/QrReader';
import { parseMemberId, validateQr } from '../services/checkin.service';

export function ScannerPage() {
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleScan = useCallback(
    async (text: string) => {
      if (!scanning) return;
      setScanning(false);
      setLoading(true);

      const memberId = parseMemberId(text);
      if (!memberId) {
        navigate('/result', {
          state: {
            memberId: '',
            firstName: 'Código',
            lastName: 'Inválido',
            planName: '—',
            planType: 'DANCE',
            classesRemaining: null,
            status: 'NOT_FOUND',
          },
        });
        return;
      }

      const result = await validateQr(memberId);
      setLoading(false);
      navigate('/result', { state: result });
    },
    [scanning, navigate],
  );

  return (
    <div className="relative w-full h-full bg-black flex flex-col items-center justify-center">
      {scanning && <QrReader onScan={handleScan} />}

      {/* Overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {/* Dark borders */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Scan frame */}
        <div className="relative z-10 w-64 h-64">
          <div className="absolute inset-0 border-2 border-white/20 rounded-xl" />
          {/* Corner accents */}
          {['top-0 left-0', 'top-0 right-0', 'bottom-0 left-0', 'bottom-0 right-0'].map((pos, i) => (
            <div
              key={i}
              className={`absolute ${pos} w-8 h-8 border-white border-4 rounded-sm`}
              style={{
                borderRight: pos.includes('left') ? 'none' : undefined,
                borderLeft: pos.includes('right') ? 'none' : undefined,
                borderBottom: pos.includes('top') ? 'none' : undefined,
                borderTop: pos.includes('bottom') ? 'none' : undefined,
              }}
            />
          ))}
        </div>

        <p className="relative z-10 mt-6 text-white text-sm font-medium tracking-wide">
          {loading ? 'Verificando...' : 'Apunta la cámara al código QR'}
        </p>
      </div>

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-center py-6 bg-gradient-to-b from-black/60 to-transparent">
        <h1 className="text-white text-lg font-bold tracking-widest uppercase">
          Presencia Latina
        </h1>
      </div>
    </div>
  );
}
