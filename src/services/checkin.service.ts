import type { MemberAccessResult } from '../types/member';
import { MOCK_MEMBERS } from '../mocks/members';

const QR_PREFIX = 'novafit:member:';

export function parseMemberId(qrText: string): string | null {
  if (qrText.startsWith(QR_PREFIX)) {
    return qrText.slice(QR_PREFIX.length);
  }
  // Also accept raw UUIDs for development convenience
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(qrText)) return qrText;
  return null;
}

export async function validateQr(memberId: string): Promise<MemberAccessResult> {
  // Simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  const member = MOCK_MEMBERS[memberId];
  if (!member) {
    return {
      memberId,
      firstName: 'Desconocido',
      lastName: '',
      planName: '—',
      planType: 'DANCE',
      classesRemaining: null,
      status: 'NOT_FOUND',
    };
  }
  return member;
}
