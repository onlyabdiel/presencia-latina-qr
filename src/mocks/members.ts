import type { MemberAccessResult } from '../types/member';

export const MOCK_MEMBERS: Record<string, MemberAccessResult> = {
  'a1b2c3d4-0001-4000-8000-000000000001': {
    memberId: 'a1b2c3d4-0001-4000-8000-000000000001',
    firstName: 'María',
    lastName: 'González',
    planName: 'Salsa & Bachata Mensual',
    planType: 'DANCE',
    classesRemaining: 8,
    status: 'VALID',
  },
  'a1b2c3d4-0002-4000-8000-000000000002': {
    memberId: 'a1b2c3d4-0002-4000-8000-000000000002',
    firstName: 'Carlos',
    lastName: 'Mendoza',
    planName: 'Combo Gym + Baile',
    planType: 'COMBO',
    classesRemaining: 3,
    status: 'VALID',
  },
  'a1b2c3d4-0003-4000-8000-000000000003': {
    memberId: 'a1b2c3d4-0003-4000-8000-000000000003',
    firstName: 'Sofía',
    lastName: 'Ramírez',
    planName: 'Merengue Mensual',
    planType: 'DANCE',
    classesRemaining: 0,
    status: 'EXPIRED',
  },
};
