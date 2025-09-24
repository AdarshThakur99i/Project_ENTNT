import { db } from './db';
import { generateSeedCandidates } from '../../data/CandidatesFunctions/mockCandidates';
import type { Assessment } from '../../data/AssessmentFunctions/assessment';
import type { Job, JobType, Salary, Experience, JobStatus } from '@/data/JobsData/Jobs.types';

const TAG_POOL = ['React', 'TypeScript', 'Node.js', 'Remote', 'GraphQL', 'CSS', 'Senior', 'JavaScript', 'Mid-Level', 'Contract', 'Vue', 'Angular', 'AWS'];

function generateRandomJobs(): Omit<Job, 'id'>[] {
  const jobs: Omit<Job, 'id'>[] = [];
  const titles = ['Software Engineer', 'Product Designer', 'Frontend Developer', 'Data Analyst', 'UX Designer', 'Marketing Manager'];
  const companies = ['TalentFlow'];
  const locations = ['Chicago, IL', 'New York, NY', 'San Francisco, CA', 'Austin, TX', 'Remote'];
  const jobTypes: JobType[] = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
  const totalJobs = 25;
  const statuses: JobStatus[] = ['active', 'active', 'active', 'archived', 'inactive'];

  for (let i = 1; i <= totalJobs; i++) {
    const salaryMin = Math.floor(Math.random() * 40 + 50) * 1000; 
    const salary: Salary = {
      min: salaryMin,
      max: salaryMin + Math.floor(Math.random() * 20 + 5) * 1000,
      currency: 'USD',
      period: 'annually'
    };
    
   
    const expMin = Math.floor(Math.random() * 5); 
    const experience: Experience = {
      min: expMin,
      max: expMin + Math.floor(Math.random() * 3 + 2), 
    };
    
    const postedDate = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString();
    
    const randomTags = TAG_POOL.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 3) + 2);

    jobs.push({
      title: titles[i % titles.length],
      status: statuses[i % statuses.length],
      tags: randomTags,
      order: i,
      company: companies[i % companies.length],
      location: locations[i % locations.length],
      jobType: jobTypes[i % jobTypes.length],
      experience,
      salary,
      postedDate,
    });
  }
  return jobs;
}



function generateSeedAssessments(jobs: Omit<Job, 'id'>[]): Omit<Assessment, 'id'>[] {
  const allAssessments: Omit<Assessment, 'id'>[] = [];

  const generateGeneralAssessment = (title: string, jobId: number): Omit<Assessment, 'id' | 'jobId'> => ({
    title: title,
    sections: [
      {
        id: `sec-${jobId}-${Date.now()}`,
        title: "General Aptitude",
        questions: [
          { id: `q-${jobId}-1`, text: "Describe a situation where you had to solve a difficult problem.", isRequired: true, details: { type: 'long-text' } },
          { id: `q-${jobId}-2`, text: "What are your biggest strengths?", isRequired: true, details: { type: 'short-text' } },
          { id: `q-${jobId}-3`, text: "How do you handle pressure or stressful situations?", isRequired: true, details: { type: 'long-text' } },
        ]
      },
      {
        id: `sec-${jobId}-2-${Date.now()}`,
        title: "Role-specific Skills",
        questions: [
            { id: `q-${jobId}-4`, text: "What are your long-term career goals?", isRequired: false, details: { type: 'long-text' } },
            { id: `q-${jobId}-5`, text: "Why are you interested in this role at our company?", isRequired: true, details: { type: 'long-text' } },
        ]
      }
    ]
  });

  // Loop through each job to create assessments for it
  jobs.forEach((_job, index) => {
    const jobId = index + 1; // Assuming job IDs will be 1, 2, 3...

    // Create and add 3 different general assessments for the current job
    allAssessments.push({
      jobId,
      ...generateGeneralAssessment("Initial Screening Assessment", jobId)
    });

    allAssessments.push({
      jobId,
      ...generateGeneralAssessment("Cultural Fit Interview", jobId)
    });
    
    allAssessments.push({
      jobId,
      ...generateGeneralAssessment("Technical Skills Review", jobId)
    });
  });

  return allAssessments;
}


export async function seedDatabase() {
  const jobCount = await db.jobs.count();
  const candidateCount = await db.candidates.count();
  const assessmentCount = await db.assessments.count();

  if (jobCount === 0 && candidateCount === 0 && assessmentCount === 0) {
    console.log("Seeding database with initial data...");
    
    const initialJobs = generateRandomJobs();
    await db.jobs.bulkAdd(initialJobs as Job[]);
    console.log(` ${initialJobs.length} jobs seeded.`);

    const totalJobs = initialJobs.length;
    const initialCandidates = generateSeedCandidates(totalJobs); 
    await db.candidates.bulkAdd(initialCandidates);
    console.log(` ${initialCandidates.length} candidates seeded.`);

    // Pass the generated jobs to the assessment seeder
    const initialAssessments = generateSeedAssessments(initialJobs);
    await db.assessments.bulkAdd(initialAssessments as Assessment[]);
    console.log(` ${initialAssessments.length} assessments seeded.`);
    
    console.log("Database seeded successfully.");
  }
}