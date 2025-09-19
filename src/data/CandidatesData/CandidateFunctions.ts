import { ALL_CANDIDATES } from './mockCandidates';
import type { Candidate } from './mockCandidates';

let MOCK_CANDIDATES: Candidate[] = JSON.parse(JSON.stringify(ALL_CANDIDATES));

export const fetchCandidates = async (stageFilter: string | 'all') => {
  console.log(`SERVICE: Fetching candidates with stage filter: ${stageFilter}`);
  
  return new Promise<Candidate[]>((resolve) => {
    setTimeout(() => {
      if (stageFilter === 'all') {
        resolve([...MOCK_CANDIDATES]);
      } else {
        const filtered = MOCK_CANDIDATES.filter(c => c.currentStage === stageFilter);
        resolve(filtered);
      }
    }, 500); 
  });
};

export const getCandidateById = async (id: number) => {
  console.log(`SERVICE: Fetching candidate with ID: ${id}`);
  
  return new Promise<Candidate | null>((resolve) => {
    setTimeout(() => {
      const candidate = MOCK_CANDIDATES.find(c => c.id === id);
      resolve(candidate || null); 
    }, 300); // simulateing network delay
  });
};

export const updateCandidate = async (updatedCandidate: Candidate) => {
  return new Promise<Candidate>((resolve) => {
    setTimeout(() => {
      const index = MOCK_CANDIDATES.findIndex(c => c.id === updatedCandidate.id);
      if (index !== -1) {
        MOCK_CANDIDATES[index] = { ...updatedCandidate };
        resolve(MOCK_CANDIDATES[index]);
      } else {
        resolve(updatedCandidate); 
      }
    }, 300);
  });
};