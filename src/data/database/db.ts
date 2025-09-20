
import Dexie, { type EntityTable } from 'dexie';
import type { Job } from '../JobsData/Jobs.types';
import type { Candidate } from '../CandidatesFunctions/mockCandidates';
import type { Assessment } from '../AssessmentFunctions/assessment';


export class MyDatabase extends Dexie {
  jobs!: EntityTable<Job, 'id'>;
  candidates!: EntityTable<Candidate, 'id'>;
  assessments!: EntityTable<Assessment, 'id'>;

  constructor() {
    super('MyMockDatabase');
    this.version(1).stores({
      jobs: '++id, title, status,order', 
      candidates: '++id, name, currentStage',
      assessments: '++id, jobId',
    });
  }
}

export const db = new MyDatabase();