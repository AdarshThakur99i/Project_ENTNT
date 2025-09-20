import Dexie, { type EntityTable } from 'dexie';
import type { Job } from '../../data/JobsData/Jobs.types';
import type { Assessment, AssessmentResponse } from '../../data/AssessmentFunctions/assessment';
import type { Candidate } from '../../data/CandidatesFunctions/mockCandidates';

export class MyDatabase extends Dexie {
  jobs!: EntityTable<Job, 'id'>;
  candidates!: EntityTable<Candidate, 'id'>;
  assessments!: EntityTable<Assessment, 'id'>;
  assessmentResponses!: EntityTable<AssessmentResponse, 'id'>;

  constructor() {
    super('MyMockDatabase');
    
    // --- THIS IS THE FIX ---
    // The version is upgraded to 2. This tells Dexie to update the database
    // with the new schema defined below.
    this.version(2).stores({
      jobs: '++id, title, status, order',
      // This schema now correctly includes the index for `jobId`
      candidates: '++id, jobId, currentStage, *name, email', 
      assessments: '++id, jobId',
      assessmentResponses: '++id, [jobId+candidateId]',
    });
  }
}

export const db = new MyDatabase();

