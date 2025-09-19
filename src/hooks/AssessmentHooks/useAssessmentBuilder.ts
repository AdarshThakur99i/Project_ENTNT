import { useState, useEffect } from 'react';
import type { Assessment } from '../../data/AssessmentData/assessment';
import { saveAssessment, loadAssessment } from '../../data/AssessmentData/assessment.service';

export const useAssessmentBuilder = (jobId: string | undefined) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load the assessment when the page opens
  useEffect(() => {
    if (!jobId) {
      setIsLoading(false);
      return;
    }

    const savedAssessment = loadAssessment(jobId);

    if (savedAssessment) {
      setAssessment(savedAssessment);
    } else {
      // If no saved assessment exists, create a new one
      setAssessment({
        id: `asmt-${Date.now()}`,
        jobId: jobId,
        title: 'New Assessment',
        sections: [],
      });
    }
    setIsLoading(false);
  }, [jobId]);

  // Effect to save the assessment whenever it changes
  useEffect(() => {
    if (assessment) {
      saveAssessment(assessment);
    }
  }, [assessment]);

  return { assessment, setAssessment, isLoading };
};