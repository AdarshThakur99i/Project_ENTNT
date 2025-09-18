export interface Candidate {
  id: number;
  name: string;
  email: string;
  currentStage: 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';
  stageHistory: { stage: string; timestamp: string }[];
}

const STAGES = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'] as const;


type Stage = typeof STAGES[number];

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan'];
const LAST_NAMES = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Thakur', 'Chauhan', 'Patel'];


export const ALL_CANDIDATES: Candidate[] = Array.from({ length: 1000 }, (_, i) => {
 
  const currentStage = STAGES[i % STAGES.length];
  
  return {
    id: i + 1,
    name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
    email: `${FIRST_NAMES[i % FIRST_NAMES.length].toLowerCase()}.${LAST_NAMES[i % LAST_NAMES.length].toLowerCase()}@example.com`,
    currentStage,
    stageHistory: [
      { stage: currentStage, timestamp: new Date().toISOString() }
    ],
  };
});