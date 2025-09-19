export interface Candidate {
  id: number;
  name: string;
  email: string;
  order?: number;
  currentStage: 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';
  stageHistory: { stage: string; timestamp: string }[];
}

const STAGES = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'] as const;

type Stage = typeof STAGES[number];

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan'];
const LAST_NAMES = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Thakur', 'Chauhan', 'Patel'];


const candidatesPerStage = Math.floor(1000 / STAGES.length);

export const ALL_CANDIDATES: Candidate[] = Array.from({ length: 1000 }, (_, i) => {
  const stageIndex = Math.floor(i / candidatesPerStage);
  const currentStage = STAGES[Math.min(stageIndex, STAGES.length - 1)];
  const orderInStage = i % candidatesPerStage;
  
  return {
    id: i + 1,
    name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
    email: `${FIRST_NAMES[i % FIRST_NAMES.length].toLowerCase()}.${LAST_NAMES[i % LAST_NAMES.length].toLowerCase()}@example.com`,
    currentStage,
    order: orderInStage, 
    stageHistory: [
      { stage: currentStage, timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString() }
    ],
  };
});