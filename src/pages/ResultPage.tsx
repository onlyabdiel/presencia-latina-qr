import { useLocation, useNavigate } from 'react-router-dom';
import type { MemberAccessResult } from '../types/member';
import { MemberCard } from '../components/MemberCard';
import { StatusBadge } from '../components/StatusBadge';

export function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state as MemberAccessResult | null;

  if (!result) {
    navigate('/', { replace: true });
    return null;
  }

  const bgColor =
    result.status === 'VALID'
      ? 'bg-green-50'
      : result.status === 'EXPIRED'
      ? 'bg-red-50'
      : 'bg-gray-50';

  return (
    <div className={`${bgColor} min-h-full flex flex-col items-center justify-center gap-6 p-6`}>
      <StatusBadge status={result.status} />

      {result.status !== 'NOT_FOUND' && <MemberCard member={result} />}

      <button
        onClick={() => navigate('/')}
        className="mt-4 px-8 py-3 bg-gray-800 text-white rounded-xl font-semibold text-sm tracking-wide hover:bg-gray-700 active:scale-95 transition-all"
      >
        Escanear otro
      </button>
    </div>
  );
}
