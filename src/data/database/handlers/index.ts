import { JobHandler } from './JobHandlers';
import { candidatesHandlers } from './CandidatesHandlers';
// import other handlers as you create them

// Combine all handlers into a single array
export const handlers = [
  ...JobHandler,
  ...candidatesHandlers,
  // ...spread in other handlers
];