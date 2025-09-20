import Dexie, { type EntityTable } from 'dexie';
import type { Job } from '../JobsData/Jobs.types';
import type { Candidate } from '../CandidatesFunctions/mockCandidates';
import type { Assessment, AssessmentResponse } from '../AssessmentFunctions/assessment';

export class MyDatabase extends Dexie {
  jobs!: EntityTable<Job, 'id'>;
  candidates!: EntityTable<Candidate, 'id'>;
  assessments!: EntityTable<Assessment, 'id'>;
  // Add the missing property declaration for assessmentResponses
  assessmentResponses!: EntityTable<AssessmentResponse, 'id'>;

  constructor() {
    super('MyMockDatabase');
    this.version(1).stores({
      jobs: '++id, title, status, order', 
      candidates: '++id, name, currentStage',
      assessments: '++id, jobId', // Removed the '&' from jobId unless it's meant to be unique
      assessmentResponses: '++id, [jobId+candidateId]', 
    });
  }
}

export const db = new MyDatabase();