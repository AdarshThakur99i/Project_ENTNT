import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Candidate } from '../../data/CandidatesData/mockCandidates';

interface CandidateCardProps {
  candidate: Candidate,
   id?: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: candidate.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="p-4 bg-white border rounded-lg shadow-sm mb-2 cursor-grab active:cursor-grabbing"
    >
      <p className="font-semibold text-gray-800">{candidate.name}</p>
      <p className="text-sm text-gray-500">{candidate.email}</p>
    </div>
  );
};

export default CandidateCard;