import { db } from './db';
import type { Job } from '../../data/JobsData/Jobs.types';


const TAG_POOL = ['React', 'TypeScript', 'Node.js', 'Remote', 'Full-time', 'GraphQL', 'CSS', 'Senior', 'JavaScript', 'Mid-Level', 'Contract'];

/**
 * Generates an array of 25 random job objects.
 */
function generateRandomJobs(): Omit<Job, 'id'>[] {
  const jobs: Omit<Job, 'id'>[] = [];
  const titles = ['Software Engineer', 'Frontend Developer', 'Backend Engineer', 'Full-Stack Developer', 'DevOps Specialist'];

  for (let i = 1; i <= 25; i++) {
  
    const title = `${titles[i % titles.length]} #${Math.floor(i / 5) + 1}`;
    
    // assign status randomly, making 'active' more common
    const status = Math.random() > 0.3 ? 'active' : 'archived';

    
    const randomTags = TAG_POOL.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2);

    jobs.push({
      title,
      status,
      tags: randomTags,
      order:i
    });
  }
  return jobs;
}

export async function seedDatabase() {
  const jobCount = await db.jobs.count();
  // Only seed if the database is empty
  if (jobCount === 0) {
    console.log("Seeding database with initial data...");
    
    const initialJobs = generateRandomJobs();
    await db.jobs.bulkAdd(initialJobs);
  
    
    console.log("Database seeded successfully.");
  }
}