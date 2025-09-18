export const TAG_POOL = ['React', 'TypeScript', 'Node.js', 'Remote', 'Full-time', 'GraphQL', 'CSS', 'Senior'];

export type JobStatus = 'active' | 'archived';

export interface Job {
  id: number;
  title: string;
  status: JobStatus;
  tags: string[];
}
export let ALL_JOBS: Job[] = Array.from({ length: 23 }, (_, i) => ({
  id: i + 1,
  title: `Software Engineer ${i + 1}`,
  status: (i % 3 === 0 ? 'archived' : 'active') as JobStatus,
  tags: [TAG_POOL[i % TAG_POOL.length], TAG_POOL[(i + 3) % TAG_POOL.length]],
}));