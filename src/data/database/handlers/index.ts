import { jobsHandlers } from './JobHandlers';
import {candidateHandlers} from './CandidateHandlers';

export const handlers = [
  ...jobsHandlers,
  ...candidateHandlers,
 
];