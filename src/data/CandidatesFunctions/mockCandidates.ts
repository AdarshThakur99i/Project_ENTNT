export interface Candidate {
  id: number;
  jobId: number; // Added to link a candidate to a job
  name: string;
  email: string;
  order?: number;
  currentStage: 'Applied' | 'Screening' | 'Interview' | 'Hired' | 'Rejected';
  stageHistory: { stage: string; timestamp: string }[];
  notes?: Note[];
}
export interface Note {
  noteId: number,
  text: string;
  timestamp: string;
}

const STAGES = ['Applied', 'Screening', 'Interview', 'Hired', 'Rejected'] as const;

const FIRST_NAMES = ['Aarav', 'Vivaan', 'Aditya', 'Vihaan', 'Arjun', 'Sai', 'Reyansh', 'Ayaan'];
const LAST_NAMES = ['Sharma', 'Verma', 'Gupta', 'Singh', 'Kumar', 'Thakur', 'Chauhan', 'Patel'];

/**
 * Generates a list of candidate data to be seeded into the database.
 * @param totalJobs The total number of jobs to distribute candidates among.
 * @returns An array of candidate objects without the 'id' property.
 */
export function generateSeedCandidates(totalJobs: number): Omit<Candidate, 'id'>[] {
    const candidates: Omit<Candidate, 'id'>[] = [];
    const totalCandidates = 1000;
    const candidatesPerJob = Math.floor(totalCandidates / totalJobs);

    for (let i = 0; i < totalCandidates; i++) {
        const stageIndex = Math.floor((i % candidatesPerJob) / (candidatesPerJob / STAGES.length));
        const currentStage = STAGES[Math.min(stageIndex, STAGES.length - 1)];
        const orderInStage = i % (candidatesPerJob / STAGES.length);

        candidates.push({
            jobId: (i % totalJobs) + 1,
            name: `${FIRST_NAMES[i % FIRST_NAMES.length]} ${LAST_NAMES[i % LAST_NAMES.length]}`,
            email: `${FIRST_NAMES[i % FIRST_NAMES.length].toLowerCase()}.${LAST_NAMES[i % LAST_NAMES.length].toLowerCase()}@example.com`,
            currentStage,
            order: orderInStage,
            stageHistory: [{
                stage: currentStage,
                timestamp: new Date(Date.now() - Math.random() * 86400000).toISOString()
            }],
            notes: [],
        });
    }
    return candidates;
}
