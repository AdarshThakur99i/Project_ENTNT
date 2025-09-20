import { db } from './db';
import type { Job } from '../../data/JobsData/Jobs.types';
import { generateSeedCandidates } from '../../data/CandidatesFunctions/mockCandidates';
import type { Assessment } from '../../data/AssessmentFunctions/assessment';

const TAG_POOL = ['React', 'TypeScript', 'Node.js', 'Remote', 'Full-time', 'GraphQL', 'CSS', 'Senior', 'JavaScript', 'Mid-Level', 'Contract'];

function generateRandomJobs(): Omit<Job, 'id'>[] {
  const jobs: Omit<Job, 'id'>[] = [];
  const titles = ['Software Engineer', 'Frontend Developer', 'Backend Engineer', 'Full-Stack Developer', 'DevOps Specialist'];
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

function generateSeedAssessments(): Omit<Assessment, 'id'>[] {
    return [
        
        {
            jobId: 1,
            title: "Frontend Developer Skills Test",
            sections: [
                {
                    id: 'sec-1-1',
                    title: "Core JavaScript",
                    questions: [
                        { id: 'q-1-1-1', text: "What is the difference between `let`, `const`, and `var`?", isRequired: true, details: { type: 'long-text' } },
                        { id: 'q-1-1-2', text: "Which of these is a primitive data type?", isRequired: true, details: { type: 'single-choice', options: ['Object', 'Array', 'String', 'Function'] }, correctAnswer: 'String' }
                    ]
                },
                {
                    id: 'sec-1-2',
                    title: "React Fundamentals",
                    questions: [
                        { id: 'q-1-2-1', text: "Which of the following are valid React hooks?", isRequired: true, details: { type: 'multi-choice', options: ['useState', 'useEffect', 'useGlobal', 'useDOM'] }, correctAnswer: ['useState', 'useEffect'] }
                    ]
                }
            ]
        },
        {
            jobId: 2,
            title: "Technical Knowledge Screening",
            sections: [
                {
                    id: 'sec-2-1',
                    title: "Problem Solving",
                    questions: [
                        { id: 'q-2-1-1', text: "Please upload a code file that solves the FizzBuzz problem.", isRequired: false, details: { type: 'file-upload' } }
                    ]
                }
            ]
        }
    ];
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

    const initialAssessments = generateSeedAssessments();
    await db.assessments.bulkAdd(initialAssessments as Assessment[]);
    console.log(` ${initialAssessments.length} assessments seeded.`);
    
    console.log("Database seeded successfully.");
  }
}

