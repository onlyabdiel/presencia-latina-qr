import type { AccessStatus } from '../types/member';

interface Props {
  status: AccessStatus;
}

const config: Record<AccessStatus, { bg: string; icon: string; label: string }> = {
  VALID: { bg: 'bg-green-500', icon: '✓', label: 'Acceso Válido' },
  EXPIRED: { bg: 'bg-red-500', icon: '✗', label: 'Plan Vencido' },
  NOT_FOUND: { bg: 'bg-gray-500', icon: '?', label: 'QR No Reconocido' },
};

export function StatusBadge({ status }: Props) {
  const { bg, icon, label } = config[status];
  return (
    <div className={`${bg} rounded-2xl px-8 py-6 flex flex-col items-center gap-2 text-white shadow-lg`}>
      <span className="text-6xl font-bold leading-none">{icon}</span>
      <span className="text-xl font-semibold tracking-wide">{label}</span>
    </div>
  );
}
