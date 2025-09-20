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
    const originalCandidates = [...searchedCandidates]; 
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
      (prev || []).map(c => (c.id === updatedCandidate.id ? updatedCandidate : c))
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
      return  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  Loading Kanban Board...</div>;
  }

  return (
     <div className="h-screen flex flex-col bg-gray-50 kanban-board">
    <div className="h-screen flex flex-col bg-gray-50">
      <div className="flex-shrink-0 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
           <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Kanban Board</h1>
                <p className="text-gray-600 mt-1 text-sm">Visually track candidates through the hiring stages.Drag and Drop to move through stages.</p>
              </div>
              <Link 
                to={`/jobs/${jobId}/candidates`} 
                className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all text-sm"
              >
                <svg className="w-5 h-5 mr-2 -ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                List View
              </Link>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <DndContext
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          collisionDetection={closestCorners}
        >
          <div className="h-full flex gap-4 p-6">
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

