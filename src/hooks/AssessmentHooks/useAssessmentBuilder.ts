import { useState, useEffect } from 'react';
import type { Assessment } from '../../data/AssessmentFunctions/assessment';
import { saveAssessment, loadAssessment } from '../../data/AssessmentFunctions/assessment.service';

export const useAssessmentBuilder = (jobId: string | undefined) => {
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); 

  useEffect(() => {
    if (!jobId) {
      setIsLoading(false);
      return;
    }
    const savedAssessment = loadAssessment(jobId);
    if (savedAssessment) {
      setAssessment(savedAssessment);
    } else {
      setAssessment({
        id: `asmt-${Date.now()}`,
        jobId: jobId,
        title: 'New Assessment',
        sections: [],
      });
    }
    setIsLoading(false);
  }, [jobId]);


  const setAssessmentAndMarkDirty = (newAssessment: Assessment) => {
    setAssessment(newAssessment);
    setIsDirty(true);
  };

  // function to manually save changes
  const saveChanges = () => {
    if (assessment) {
      saveAssessment(assessment);
      setIsDirty(false);
      setShowConfirmation(true); // 2. Use the setter function
      setTimeout(() => setShowConfirmation(false), 2000); // Hide after 2 seconds
    }
  };

  return { 
    assessment, 
    setAssessment: setAssessmentAndMarkDirty,
    isLoading, 
    isDirty, 
    saveChanges,
    showConfirmation,
  };
};