import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DndContext, closestCorners, DragOverlay } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';

import type { Candidate } from '../data/CandidatesFunctions/mockCandidates';
import { useCandidates } from '../hooks/CandidatesHook/useCandidates';
import * as candidateApi from '../api/candidatesApi/candidateApi';

import KanbanColumn from '../components/CandidateComponents/KanbanColumn';
import CandidateCard from '../components/CandidateComponents/CandidateCard';

const stages = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'];

const KanbanBoard: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const numericJobId = jobId ? parseInt(jobId, 10) : undefined;

  const { searchedCandidates, setAllCandidates, isLoading } = useCandidates(numericJobId);
  
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);
  const [columnSearchTerms, setColumnSearchTerms] = useState<{ [key: string]: string }>({});

  const candidatesByStage = useMemo(() => {
    return stages.reduce((acc, stage) => {
      acc[stage] = (searchedCandidates || []) 
        .filter(c => c.currentStage === stage)
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      return acc;
    }, {} as { [key: string]: Candidate[] });
  }, [searchedCandidates]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!searchedCandidates) return;

    const candidate = searchedCandidates.find(c => c.id.toString() === active.id.toString());
    setActiveCandidate(candidate || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveCandidate(null);

    
    
    if (!over || !searchedCandidates) return;

    const activeId = Number(active.id);
    const originalCandidates = searchedCandidates; 
    const activeCandidate = originalCandidates.find(c => c.id === activeId);
    
    if (!activeCandidate) return;

    const overId = over.id.toString();
    const activeContainer = activeCandidate.currentStage;

    let overContainer: string | undefined;
    if (stages.includes(overId)) {
      overContainer = overId;
    } else {
      const overCandidate = originalCandidates.find(c => c.id.toString() === overId);
      overContainer = overCandidate?.currentStage;
    }

    if (!overContainer || activeContainer === overContainer) {
      return;
    }
    
    const updatedCandidate: Candidate = {
      ...activeCandidate,
      currentStage: overContainer as Candidate['currentStage'],
      stageHistory: [
        ...activeCandidate.stageHistory,
        { stage: overContainer, timestamp: new Date().toISOString() }
      ]
    };

    setAllCandidates(prev =>
      prev.map(c => (c.id === updatedCandidate.id ? updatedCandidate : c))
    );

    try {
        await candidateApi.updateCandidate(updatedCandidate);
    } catch (error) {
        console.error("Failed to update candidate stage:", error);
        setAllCandidates(originalCandidates); 
    }
  };

  const handleColumnSearchChange = (stage: string, value: string) => {
    setColumnSearchTerms(prev => ({ ...prev, [stage]: value }));
  };

  if (isLoading) {
      return <div className="p-8 text-center text-gray-500">Loading Kanban Board...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="h-screen flex flex-col">
        <div className="flex-shrink-0 bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
            <Link 
              to={`/jobs/${jobId}/candidates`} 
              className="px-4 py-2 bg-black-600 text-white rounded-md hover:bg-black-700 transition-colors"
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

