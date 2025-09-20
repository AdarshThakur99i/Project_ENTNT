import { useState, useEffect, useCallback } from 'react';
import type { Assessment } from '../../data/AssessmentFunctions/assessment';
import { fetchAssessmentsForJob, createAssessment, updateAssessment, deleteAssessment } from '../../api/JobsApi/AssessmentApi'; 

// Define the possible states for the save operation
type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

/**
 * A custom hook to manage the state and API interactions for building a single assessment for a job.
 * @param jobId - The ID of the job for which to build the assessment.
 */
export const useAssessmentBuilder = (jobId: string | undefined) => {
  // State for the single assessment being edited
  const [activeAssessment, setActiveAssessment] = useState<Assessment | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isDirty, setIsDirty] = useState(false); // Tracks if there are unsaved changes
  
  // State to manage the UI feedback for the save operation
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  
  const numericJobId = jobId ? parseInt(jobId, 10) : 0;

  // Effect to load the assessment data when the hook mounts or jobId changes
  useEffect(() => {
    const loadAssessment = async () => {
      if (!numericJobId) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const existingAssessments = await fetchAssessmentsForJob(numericJobId);
        
        if (existingAssessments.length > 0) {
          // If an assessment exists, load the first one into the editor
          setActiveAssessment(existingAssessments[0]);
        } else {
          // If no assessment exists, prepare a new, default one to be created on first save
          const newAssessmentData: Omit<Assessment, 'id'> = {
            jobId: numericJobId,
            title: 'New Assessment',
            sections: [{
                id: `section-${Date.now()}`,
                title: 'Section 1',
                questions: []
            }],
          };
          // Cast to Assessment, as the 'id' will be added upon saving
          setActiveAssessment(newAssessmentData as Assessment);
        }
      } catch (error) {
        console.error("Failed to load assessments:", error);
        // Handle error state in UI if necessary
      } finally {
        setIsLoading(false);
        setIsDirty(false); // Start with a clean state
      }
    };

    loadAssessment();
  }, [numericJobId]);

  // A stable function to update the assessment state from the component
  const updateActiveAssessment = useCallback((updatedAssessment: Assessment) => {
    setActiveAssessment(updatedAssessment);
    setIsDirty(true); // Mark that there are now unsaved changes
  }, []);

  // A single function to handle both creating and updating the assessment
  const handleSaveChanges = async () => {
    if (!activeAssessment || !isDirty) {
      return; // Do nothing if there's no assessment or no changes
    }

    setSaveStatus('saving');
    
    try {
      let savedAssessment: Assessment;
      if ('id' in activeAssessment && activeAssessment.id) {
        // If it has an ID, it's an existing assessment, so update it
        savedAssessment = await updateAssessment(activeAssessment);
      } else {
        // If it lacks an ID, it's a new assessment, so create it
        const { id, ...assessmentData } = activeAssessment;
        savedAssessment = await createAssessment(numericJobId, assessmentData);
      }
      
      // Sync state with the returned data from the API (e.g., to get the new ID)
      setActiveAssessment(savedAssessment);
      setIsDirty(false);
      setSaveStatus('saved');
      
    } catch (error) {
      console.error("Failed to save assessment:", error);
      setSaveStatus('error');
    } finally {
      // Reset the save status indicator after 3 seconds
      setTimeout(() => setSaveStatus('idle'), 3000);
    }
  };
  
  // Handler to delete the current assessment
  const handleDeleteAssessment = async () => {
      if (!activeAssessment || !activeAssessment.id) return;
      
      try {
          await deleteAssessment(activeAssessment.id);
          // After deleting, you might want to navigate away or reset to a new default assessment
          setActiveAssessment(null); // Or reset to a new blank assessment
      } catch (error) {
          console.error("Failed to delete assessment:", error);
          // Optionally show an error message
      }
  };
  
  return { 
    activeAssessment, 
    updateActiveAssessment,
    isLoading, 
    isDirty,
    saveStatus,
    handleSaveChanges, 
    handleDeleteAssessment,
  };
};
