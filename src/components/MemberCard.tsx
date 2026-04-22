import type { MemberAccessResult } from '../types/member';

interface Props {
  member: MemberAccessResult;
}

const planTypeLabel: Record<string, string> = {
  DANCE: 'Baile',
  COMBO: 'Combo',
  GYM: 'Gimnasio',
};

const planTypeColor: Record<string, string> = {
  DANCE: 'bg-purple-100 text-purple-700',
  COMBO: 'bg-blue-100 text-blue-700',
  GYM: 'bg-orange-100 text-orange-700',
};

export function MemberCard({ member }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col items-center gap-4 w-full max-w-sm">
      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-400 overflow-hidden">
        {member.photoUrl ? (
          <img src={member.photoUrl} alt="foto" className="w-full h-full object-cover" />
        ) : (
          <span>{member.firstName.charAt(0)}{member.lastName.charAt(0)}</span>
        )}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {member.firstName} {member.lastName}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{member.planName}</p>
      </div>

      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${planTypeColor[member.planType]}`}>
        {planTypeLabel[member.planType]}
      </span>

      {member.classesRemaining !== null && (
        <div className="text-center">
          <span className="text-4xl font-bold text-gray-800">{member.classesRemaining}</span>
          <p className="text-sm text-gray-500">clases restantes</p>
        </div>
      )}
    </div>
  );
}
