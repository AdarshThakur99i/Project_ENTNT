import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Candidate } from '../../data/CandidatesFunctions/mockCandidates';
import { Link } from 'react-router-dom';

interface CandidateCardProps {
  candidate: Candidate;
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

  const cardContent = (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-semibold text-gray-800">{candidate.name}</p>
        <p className="text-sm text-gray-500">{candidate.email}</p>
      </div>
      {!isDragOverlay && (
        <div
          className="drag-handle cursor-grab active:cursor-grabbing p-2"
          {...listeners}
          {...attributes}
        >
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zM6 5v.01M6 12v.01M6 19v.01M6 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zM18 5v.01M18 12v.01M18 19v.01M18 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      style={!isDragOverlay ? style : undefined}
      className={`p-4 bg-white border rounded-lg shadow-sm mb-2 hover:shadow-md transition-shadow ${
        isDragging ? 'opacity-50' : ''
      } ${isDragOverlay ? 'rotate-3 shadow-lg cursor-grabbing' : ''}`}
    >
      {isDragOverlay ? (
        cardContent
      ) : (
        <Link
          to={`/jobs/${candidate.jobId}/candidates/${candidate.id}`}
          className="block no-underline text-current"
        >
          {cardContent}
        </Link>
      )}
    </div>
  );
};

export default CandidateCard;
