
import { http } from 'msw';
import { db } from '../db';
import type { Job } from '../../../data/JobsData/Jobs.types';

export const jobsHandlers = [
  http.get('/api/jobs', async ({ request }) => {
    console.log("MSW: Intercepted GET /api/jobs");

    const url = new URL(request.url);
    const search = url.searchParams.get('search')?.toLowerCase() || '';
    const status = url.searchParams.get('status');
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '10');

    let query = db.jobs.toCollection();

    if (status && status !== 'all') {
      query = query.where('status').equals(status);
    }
    if (search) {
      query = query.filter(job => 
        job.title.toLowerCase().includes(search) ||
        job.tags.some(tag => tag.toLowerCase().includes(search))
      );
    }

    const totalCount = await query.count();
    
    const paginatedJobs = await query
      .offset((page - 1) * pageSize)
      .limit(pageSize)
      .toArray();

    await new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));

    return Response.json({
      data: paginatedJobs,
      totalCount: totalCount,
    });
  }),

  http.post('/api/jobs', async ({ request }) => {
    console.log("MSW: Intercepted POST /api/jobs");
    const newJobData = await request.json() as Omit<Job, 'id'>;
    const newId = await db.jobs.add(newJobData);
    const newJob = await db.jobs.get(newId);
    return Response.json(newJob, { status: 201 }); 
  }),

  http.patch('/api/jobs/:id', async ({ request, params }) => {
    console.log("MSW: Intercepted PATCH /api/jobs/:id");
    const jobId = Number(params.id);
    const updates = await request.json() as Partial<Job>; 
    await db.jobs.update(jobId, updates);
    const updatedJob = await db.jobs.get(jobId);
    return Response.json(updatedJob);
  }),

  http.get('/api/jobs/:id', async ({ params }) => {
    console.log("MSW: Intercepted GET /api/jobs/:id");
    const jobId = Number(params.id);
    const job = await db.jobs.get(jobId);
    if (job) {
      return Response.json(job);
    } else {
      return new Response(JSON.stringify({ message: 'Job not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }),
];