import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import CandidateCard from './CandidateCard';
import type { Candidate } from '../../data/CandidatesData/mockCandidates';

interface KanbanColumnProps {
  id: string;
  title: string;
  candidates: Candidate[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ 
  id, 
  title, 
  candidates, 
  searchTerm, 
  onSearchChange 
}) => {
  const { setNodeRef } = useDroppable({ id });

  const filteredCandidates = useMemo(() => {
    if (!searchTerm) {
      return candidates;
    }
    const lowercasedTerm = searchTerm.toLowerCase();
    return candidates.filter(c =>
      c.name.toLowerCase().includes(lowercasedTerm) ||
      c.email.toLowerCase().includes(lowercasedTerm)
    );
  }, [candidates, searchTerm]);

  return (
   
    <div className="flex-1 min-w-0 bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col" style={{ minWidth: '400px' }}>
      
      <div className="p-5 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl capitalize text-gray-800">{title}</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
            {filteredCandidates.length}
          </span>
        </div>
        
        <input
          type="text"
          placeholder="Search in this column..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="w-full p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      
     
      <div className="flex-1 overflow-y-auto">
        <SortableContext
          items={filteredCandidates.map(c => c.id.toString())}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} className="p-5 space-y-3 min-h-full">
            {filteredCandidates.length > 0 ? (
              filteredCandidates.map(candidate => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-gray-400 text-base font-medium">
                  {searchTerm ? 'No matching candidates' : 'Drop candidates here'}
                </p>
                {searchTerm && (
                  <p className="text-gray-300 text-sm mt-2">
                    Try adjusting your search terms
                  </p>
                )}
              </div>
            )}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default KanbanColumn;