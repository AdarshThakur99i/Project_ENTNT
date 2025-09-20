import { db } from './db';
import type { Job } from '../../data/JobsData/Jobs.types';
import { generateSeedCandidates } from '../../data/CandidatesFunctions/mockCandidates';
import type { Assessment } from '../../data/AssessmentFunctions/assessment';

const TAG_POOL = ['React', 'TypeScript', 'Node.js', 'Remote', 'Full-time', 'GraphQL', 'CSS', 'Senior', 'JavaScript', 'Mid-Level', 'Contract'];

function generateRandomJobs(): Omit<Job, 'id'>[] {
  const jobs: Omit<Job, 'id'>[] = [];
  const titles = ['Software Engineer', 'Frontend Developer', 'Backend Engineer', 'Full-Stack Developer', 'DevOps Specialist','Data Analyst'];
  const totalJobs = 25;

  for (let i = 1; i <= totalJobs; i++) {
    const title = `${titles[i % titles.length]} #${Math.floor(i / 5) + 1}`;
    const status = Math.random() > 0.3 ? 'active' : 'archived';
    const randomTags = TAG_POOL.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2);

    jobs.push({
      title,
      status,
      tags: randomTags,
      order: i
    });
  }
  return jobs;
}

function generateSeedAssessments(totalJobs: number): Omit<Assessment, 'id'>[] {
    const assessments: Omit<Assessment, 'id'>[] = [];

    for (let i = 1; i <= totalJobs; i++) {
        assessments.push({
            jobId: i, 
            title: "Default Technical Screening",
            sections: [
                {
                    id: `sec-${i}-1`,
                    title: "Core Competency",
                    questions: [
                        { 
                            id: `q-${i}-1-1`, 
                            text: "Describe a challenging project you've worked on and your role in it.", 
                            isRequired: true, 
                            details: { type: 'long-text' } 
                        },
                        { 
                            id: `q-${i}-1-2`, 
                            text: "Which of these technologies are you most proficient in?", 
                            isRequired: true, 
                            details: { type: 'multi-choice', options: ['JavaScript', 'Python', 'Java', 'C#'] },
                            correctAnswer: ['JavaScript']
                        }
                    ]
                }
            ]
        });
    }
    return assessments;
}

export async function seedDatabase() {
  const jobCount = await db.jobs.count();
  const candidateCount = await db.candidates.count();
  const assessmentCount = await db.assessments.count();

 
  if (jobCount === 0 && candidateCount === 0 && assessmentCount === 0) {
    console.log("Seeding database with initial data...");
    
    const initialJobs = generateRandomJobs();
    await db.jobs.bulkAdd(initialJobs);
    console.log(` ${initialJobs.length} jobs seeded.`);

    const totalJobs = initialJobs.length;
    const initialCandidates = generateSeedCandidates(totalJobs);
    await db.candidates.bulkAdd(initialCandidates);
    console.log(` ${initialCandidates.length} candidates seeded.`);

    const initialAssessments = generateSeedAssessments(totalJobs);
    await db.assessments.bulkAdd(initialAssessments as Assessment[]);
    console.log(` ${initialAssessments.length} assessments seeded.`);
    
    console.log("Database seeded successfully.");
  }
}

