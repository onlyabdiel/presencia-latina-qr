export type PlanType = 'DANCE' | 'COMBO' | 'GYM';
export type AccessStatus = 'VALID' | 'EXPIRED' | 'NOT_FOUND';

export interface MemberAccessResult {
  memberId: string;
  firstName: string;
  lastName: string;
  photoUrl?: string;
  planName: string;
  planType: PlanType;
  classesRemaining: number | null;
  status: AccessStatus;
}
