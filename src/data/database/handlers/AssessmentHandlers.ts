
import { http } from 'msw';
import { db } from '../db';
import type { Assessment, AssessmentResponse } from '../../../data/AssessmentFunctions/assessment';

export const AssessmentHandler = [
 
  http.get('/api/jobs/:jobId/assessments', async ({ params }) => {
    const jobId = Number(params.jobId);
    const assessments = await db.assessments.where('jobId').equals(jobId).toArray();
    return Response.json(assessments);
  }),

  
  http.post('/api/jobs/:jobId/assessments', async ({ request }) => {
    const assessmentData = (await request.json()) as Omit<Assessment, 'id'>;
    const newId = await db.assessments.add(assessmentData);
    const newAssessment = await db.assessments.get(newId);
    return Response.json(newAssessment, { status: 201 });
  }),

  // update an existing assessment
   http.put('/api/assessments/:assessmentId', async ({ request, params }) => {
    const assessmentId = Number(params.assessmentId);
    const updatedData = (await request.json()) as Assessment;

    const existing = await db.assessments.get(assessmentId);
    if (!existing) {
      return new Response(`Assessment with ID ${assessmentId} not found.`, { status: 404 });
    }

    // --- THIS IS THE FIX ---
    // Use put() to replace the entire object, not update() for partial changes.
    await db.assessments.put(updatedData); 

    const updatedAssessment = await db.assessments.get(assessmentId);
    return Response.json(updatedAssessment);
  }),


  // 4. delete an assessment
  http.delete('/api/assessments/:assessmentId', async ({ params }) => {
    const assessmentId = Number(params.assessmentId);
    
    // check if the assessment exists before deleting
    const existing = await db.assessments.get(assessmentId);
    if (!existing) {
       return new Response(`Assessment with ID ${assessmentId} not found.`, { status: 404 });
    }

    await db.assessments.delete(assessmentId);
    return new Response(null, { status: 204 }); // 204 No Content is standard for successful deletes
  }),
  
  // save a candidate's assessment response
  http.post('/api/assessments/responses', async ({ request }) => {
    const responseData = (await request.json()) as Omit<AssessmentResponse, 'id'>;
    
    // Note: Ensure you have an 'assessmentResponses' table defined in your db.ts
    const newId = await db.assessmentResponses.add(responseData);
    const newResponse = await db.assessmentResponses.get(newId);
    
    return Response.json(newResponse, { status: 201 });
  }),
];