import React, { useState, useEffect, useMemo } from 'react';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';

import type { Candidate } from '../data/CandidatesData/mockCandidates';
import * as candidateService from '../data/CandidatesData/CandidateFunctions';

import KanbanColumn from '../components/CandidateComponents/KanbanColumn';
import CandidateCard from '../components/CandidateComponents/CandidateCard';
import { Link } from 'react-router-dom';

const stages = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'];

const KanbanBoard: React.FC = () => {
  // local state for all candidates
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [columnSearchTerms, setColumnSearchTerms] = useState<{ [key: string]: string }>({});

 
  useEffect(() => {
    const loadCandidates = async () => {
      const data = await candidateService.fetchCandidates('all');
      setCandidates(data);
    };
    loadCandidates();
  }, []);

 
  const candidatesByStage = useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage] = candidates
        .filter(c => c.currentStage === stage)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return acc;
    }, {} as { [key: string]: Candidate[] });
  }, [candidates]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const candidate = candidates.find(c => c.id.toString() === active.id);
    setActiveCandidate(candidate || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    if (!over) return;

    const activeId = active.id as string;
    const activeCandidate = candidates.find(c => c.id.toString() === activeId);
    if (!activeCandidate) return;

    const overId = over.id as string;
    const activeContainer = activeCandidate.currentStage;

    let overContainer: string | undefined;
    if (stages.includes(overId)) {
      overContainer = overId;
    } else {
      const overCandidate = candidates.find(c => c.id.toString() === overId);
      overContainer = overCandidate?.currentStage;
    }

    if (!overContainer || activeContainer === overContainer) {
      return;
    }

   
    const targetCandidates = candidates.filter(c => c.currentStage === overContainer);
    const maxOrder = targetCandidates.length > 0 ? Math.max(...targetCandidates.map(c => c.order ?? 0)) : 0;

    const updatedCandidate = {
      ...activeCandidate,
      currentStage: overContainer as Candidate['currentStage'],
      order: maxOrder + 1,
      stageHistory: [
        ...activeCandidate.stageHistory,
        { stage: overContainer, timestamp: new Date().toISOString() }
      ]
    };

    // Update local state
    setCandidates(prev =>
      prev.map(candidate =>
        candidate.id === updatedCandidate.id ? updatedCandidate : candidate
      )
    );

    // Persist to mock backend
    await candidateService.updateCandidate(updatedCandidate);

    // Reset search term for the target column to ensure the new item is visible
    setColumnSearchTerms(prev => ({ ...prev, [overContainer]: '' }));
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
                  candidates={candidatesByStage[stage] || []}
                  searchTerm={columnSearchTerms[stage] || ''}
                  onSearchChange={(value) => handleColumnSearchChange(stage, value)}
                />
              ))}
            </div>
            
            <DragOverlay>
              {activeCandidate ? (
                <CandidateCard candidate={activeCandidate} isDragOverlay={true} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default KanbanBoard;