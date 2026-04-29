import axios from 'axios';
import type { MemberAccessResult } from '../types/member';
import { getToken, clearToken } from './auth.service';

const API_URL = import.meta.env.VITE_API_URL;

const QR_PREFIX = 'novafit:member:';

export function parseMemberId(qrText: string): string | null {
  if (qrText.startsWith(QR_PREFIX)) {
    return qrText.slice(QR_PREFIX.length);
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(qrText)) return qrText;
  return null;
}

export async function validateQr(memberId: string): Promise<MemberAccessResult & { unauthorized?: boolean }> {
  const token = getToken();

  try {
    const res = await axios.post(
      `${API_URL}/check-ins`,
      { memberId, method: 'QR', checkInType: 'DANCE' },
      { headers: { Authorization: `Bearer ${token}` } },
    );

    const { member } = res.data;
    return {
      memberId: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      photoUrl: member.photoUrl ?? undefined,
      planName: 'Clase de Baile',
      planType: 'DANCE',
      classesRemaining: null,
      status: 'VALID',
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        clearToken();
        return { memberId, firstName: '', lastName: '', planName: '', planType: 'DANCE', classesRemaining: null, status: 'NOT_FOUND', unauthorized: true };
      }
      if (err.response?.status === 404) {
        return { memberId, firstName: 'Miembro', lastName: 'No Encontrado', planName: '—', planType: 'DANCE', classesRemaining: null, status: 'NOT_FOUND' };
      }
      if (err.response?.status === 400) {
        const member = err.response.data?.member;
        return {
          memberId,
          firstName: member?.firstName ?? 'Acceso',
          lastName: member?.lastName ?? 'Denegado',
          planName: err.response.data?.message ?? 'Plan vencido o sin clases',
          planType: 'DANCE',
          classesRemaining: null,
          status: 'EXPIRED',
        };
      }
    }
    return { memberId, firstName: 'Error', lastName: 'de conexión', planName: '—', planType: 'DANCE', classesRemaining: null, status: 'NOT_FOUND' };
  }
}
