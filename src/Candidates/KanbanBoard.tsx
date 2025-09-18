import React, { useState } from 'react';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';

import type { Candidate } from '../data/CandidatesData/mockCandidates';

import { useCandidates } from '../hooks/CandidatesHook/useCandidates';
import KanbanColumn from '../components/CandidateComponents/KanbanColumn';
import CandidateCard from '../components/CandidateComponents/CandidateCard';
import { Link } from 'react-router-dom';

const KanbanBoard: React.FC = () => {
  const { searchedCandidates, setAllCandidates } = useCandidates();
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [columnSearchTerms, setColumnSearchTerms] = useState<{ [key: string]: string }>({});

  const stages = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'];

  const candidatesByStage = stages.reduce((acc, stage) => {
    const stageCandidate = searchedCandidates
      .filter(c => c.currentStage === stage)
      .sort((a, b) => {
        // sort by order field if it exists, otherwise by most recent stage change
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order;
        }
        if (a.stageHistory.length > 0 && b.stageHistory.length > 0) {
          const aLatest = new Date(a.stageHistory[a.stageHistory.length - 1].timestamp);
          const bLatest = new Date(b.stageHistory[b.stageHistory.length - 1].timestamp);
          return bLatest.getTime() - aLatest.getTime();
        }
        return 0;
      });
    
    acc[stage] = stageCandidate;
    return acc;
  }, {} as { [key: string]: Candidate[] });

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const candidate = searchedCandidates.find(c => c.id === active.id);
    setActiveCandidate(candidate || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over || active.id === over.id) return;

    const activeId = active.id as number;
    const newStage = over.id as Candidate['currentStage'];

    setAllCandidates(prev => {
      const candidateToMove = prev.find(c => c.id === activeId);
      if (!candidateToMove || candidateToMove.currentStage === newStage) return prev;

      // update the moved candidate
      const updatedCandidate: Candidate = {
        ...candidateToMove,
        currentStage: newStage,
        order: 0, 
        stageHistory: [
          ...candidateToMove.stageHistory,
          { stage: newStage, timestamp: new Date().toISOString() }
        ]
      };

      
      return prev.map(candidate => {
        if (candidate.id === activeId) {
          return updatedCandidate;
        }
        
        // increment order for other candidates in the same new stage
        if (candidate.currentStage === newStage) {
          return {
            ...candidate,
            order: (candidate.order || 0) + 1
          };
        }
        
        return candidate;
      });
    });
  };

  const handleColumnSearchChange = (stage: string, value: string) => {
    setColumnSearchTerms(prev => ({ ...prev, [stage]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
    
      <div className="h-screen flex flex-col">
     
        <div className="flex-shrink-0 bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
            <Link 
              to="/candidates/candidatesList" 
              className="px-4 py-2 bg-black-500 text-white rounded-md hover:bg-black-600 transition-colors"
            >
              Go to List View
            </Link>
          </div>
        </div>

        
        <div className="flex-1 overflow-hidden">
          <DndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            collisionDetection={closestCorners}
          >
            
            <div className="h-full flex gap-4 overflow-x-auto p-6">
              {stages.map(stage => (
                <KanbanColumn
                  key={stage}
                  id={stage}
                  title={stage}
                  candidates={candidatesByStage[stage]}
                  searchTerm={columnSearchTerms[stage] || ''}
                  onSearchChange={(value) => handleColumnSearchChange(stage, value)}
                />
              ))}
            </div>
            
            <DragOverlay>
              {activeCandidate ? <CandidateCard candidate={activeCandidate} /> : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;