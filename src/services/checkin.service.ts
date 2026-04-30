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

async function fetchEnrollment(memberId: string, token: string): Promise<{ planName: string; planType: 'DANCE' | 'COMBO' | 'GYM'; classesRemaining: number | null }> {
  try {
    const res = await axios.get(`${API_URL}/enrollments`, {
      params: { memberId, status: 'ACTIVE' },
      headers: { Authorization: `Bearer ${token}` },
    });
    const enrollments: Array<{ classesRemaining: number | null; plan: { name: string; planType: string } }> = res.data?.data ?? res.data ?? [];
    const dance = enrollments.find((e) => e.plan?.planType === 'DANCE' || e.plan?.planType === 'COMBO');
    if (dance) {
      return {
        planName: dance.plan.name,
        planType: dance.plan.planType as 'DANCE' | 'COMBO',
        classesRemaining: dance.classesRemaining,
      };
    }
  } catch {
    // non-critical, fall through to defaults
  }
  return { planName: 'Clase de Baile', planType: 'DANCE', classesRemaining: null };
}

export async function validateQr(memberId: string): Promise<MemberAccessResult & { unauthorized?: boolean }> {
  const token = getToken();

  try {
    const checkInRes = await axios.post(
      `${API_URL}/check-ins`,
      { memberId, method: 'QR', checkInType: 'DANCE' },
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const enrollment = await fetchEnrollment(memberId, token!);

    const { member } = checkInRes.data;
    return {
      memberId: member.id,
      firstName: member.firstName,
      lastName: member.lastName,
      photoUrl: member.photoUrl ?? undefined,
      planName: enrollment.planName,
      planType: enrollment.planType,
      classesRemaining: enrollment.classesRemaining,
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
        const enrollment = await fetchEnrollment(memberId, token!);
        return {
          memberId,
          firstName: member?.firstName ?? 'Acceso',
          lastName: member?.lastName ?? 'Denegado',
          planName: enrollment.planName,
          planType: enrollment.planType,
          classesRemaining: enrollment.classesRemaining,
          status: 'EXPIRED',
        };
      }
    }
    return { memberId, firstName: 'Error', lastName: 'de conexión', planName: '—', planType: 'DANCE', classesRemaining: null, status: 'NOT_FOUND' };
  }
}
