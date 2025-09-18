
import { ALL_CANDIDATES } from './mockCandidates';
import type { Candidate } from './mockCandidates';

export const fetchCandidates = async (stageFilter: string | 'all') => {
  console.log(`SERVICE: Fetching candidates with stage filter: ${stageFilter}`);
  
  return new Promise<Candidate[]>((resolve) => {
    setTimeout(() => {
      if (stageFilter === 'all') {
        resolve([...ALL_CANDIDATES]);
      } else {
        const filtered = ALL_CANDIDATES.filter(c => c.currentStage === stageFilter);
        resolve(filtered);
      }
    }, 500); 
  });
};