import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Candidate } from '../../data/CandidatesData/mockCandidates';

interface CandidateCardProps {
  candidate: Candidate;
  id?: string;
  isDragOverlay?: boolean; 
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, isDragOverlay = false }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: candidate.id.toString(), 
    disabled: isDragOverlay, 
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      style={!isDragOverlay ? style : undefined}
      {...(!isDragOverlay ? attributes : {})}
      {...(!isDragOverlay ? listeners : {})}
      className={`p-4 bg-white border rounded-lg shadow-sm mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      } ${isDragOverlay ? 'rotate-3 shadow-lg' : ''}`}
    >
      <p className="font-semibold text-gray-800">{candidate.name}</p>
      <p className="text-sm text-gray-500">{candidate.email}</p>
    </div>
  );
};

export default CandidateCard;