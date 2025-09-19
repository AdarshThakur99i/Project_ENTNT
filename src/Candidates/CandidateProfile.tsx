import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCandidates } from '../hooks/CandidatesHook/useCandidates';
import type { Candidate, Note as NoteType } from '../data/CandidatesData/mockCandidates';
import Note from '../components/CandidateComponents/Note';
import NoteInput from '../components/CandidateComponents/NoteInput';

const CandidateProfile: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const { searchedCandidates, setAllCandidates, isLoading } = useCandidates();

  const [candidate, setCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    
    if (!isLoading) {
      const currentCandidate = searchedCandidates.find(c => c.id === parseInt(candidateId || ''));
      setCandidate(currentCandidate || null);
    }
  }, [candidateId, searchedCandidates, isLoading]);

  const handleSaveNote = (noteText: string) => {
    const newNote: NoteType = {
      noteId: Date.now(),
      text: noteText,
      timestamp: new Date().toISOString(),
    };

    setAllCandidates(prevCandidates =>
      prevCandidates.map(c =>
        c.id === candidate?.id
          ? { ...c, notes: [newNote, ...(c.notes || [])] }
          : c
      )
    );
  };

  const handleDeleteNote = (noteIdToDelete: number) => {
    setAllCandidates(prevCandidates =>
      prevCandidates.map(c => {
        if (c.id === candidate?.id) {
          const updatedNotes = (c.notes || []).filter(
            note => note.noteId !== noteIdToDelete
          );
          return { ...c, notes: updatedNotes };
        }
        return c;
      })
    );
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading candidate...</div>;
  }

  if (!candidate) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 font-semibold">Candidate not found.</p>
        <Link to="/candidates/candidatesList" className="text-blue-500 hover:underline mt-4 block">
          &larr; Back to Candidate List
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <Link to="/candidates/candidatesList" className="text-blue-500 hover:underline mb-6 block">&larr; Back to List</Link>

     
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-12">
        <h1 className="text-4xl font-bold text-gray-900">{candidate.name}</h1>
        <p className="text-lg text-gray-600 mt-2">{candidate.email}</p>
        <p className="mt-4">
          Current Stage:
          <span className="ml-2 font-semibold px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {candidate.currentStage}
          </span>
        </p>
      </div>

    
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-8 border-b pb-2">Timeline</h2>
        <div className="relative">
          <div className="absolute left-0 top-2 h-1 w-full bg-blue-200"></div>
          <div className="relative flex justify-between">
            {candidate.stageHistory.map((entry, index) => (
              <div key={index} className="flex flex-col items-center text-center w-40">
                <div className="w-5 h-5 bg-blue-500 rounded-full border-4 border-white z-10"></div>
                <p className="font-bold text-lg mt-2">{entry.stage}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(entry.timestamp).toLocaleString('en-IN', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
    
      <div>
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Notes</h2>
        <NoteInput onSave={handleSaveNote} />
        <div className="mt-6 space-y-4">
          {candidate.notes && candidate.notes.length > 0 ? (
            candidate.notes.map((note) => (
              <Note
                key={note.noteId}
                text={note.text}
                timestamp={note.timestamp}
                onDelete={() => handleDeleteNote(note.noteId)}
              />
            ))
          ) : (
            <p className="text-gray-500 italic">No notes yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;