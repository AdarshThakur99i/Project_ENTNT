import React from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Section } from '../data/AssessmentFunctions/assessment';
import SectionEditor from '../components/AssessmentComponents/SectionEditor';
import AssessmentPreview from '../components/AssessmentComponents/AssessmentPreview';
import { useAssessmentBuilder } from '../hooks/AssessmentHooks/useAssessmentBuilder';

// A helper component for the save button to show different states
const SaveButton: React.FC<{ status: 'idle' | 'saving' | 'saved' | 'error'; isDirty: boolean; onClick: () => void; }> = ({ status, isDirty, onClick }) => {
  const baseClasses = "px-5 py-2 text-white font-semibold rounded-lg transition-colors duration-200";
  const disabledClasses = "disabled:bg-gray-400 disabled:cursor-not-allowed";

  switch (status) {
    case 'saving':
      return <button className={`${baseClasses} bg-yellow-500`} disabled>Saving...</button>;
    case 'saved':
      return <button className={`${baseClasses} bg-green-500`} disabled>Saved!</button>;
    case 'error':
      return <button className={`${baseClasses} bg-red-500`} onClick={onClick}>Save Error</button>;
    default:
      return (
        <button 
          onClick={onClick} 
          disabled={!isDirty} 
          className={`${baseClasses} bg-blue-600 hover:bg-blue-700 ${disabledClasses}`}
        >
          Save Changes
        </button>
      );
  }
};


const AssessmentBuilder: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  
  // Destructuring the return values from the updated custom hook
  const { 
    activeAssessment,
    updateActiveAssessment,
    isLoading, 
    isDirty,
    saveStatus,
    handleSaveChanges,
  } = useAssessmentBuilder(jobId);

  // Handlers now update the single 'activeAssessment' via the 'updateActiveAssessment' function from the hook
  const handleAddSection = () => {
    if (!activeAssessment) return;
    const newSection: Section = { id: `sec-${Date.now()}`, title: 'New Section', questions: [] };
    const updated = { ...activeAssessment, sections: [...activeAssessment.sections, newSection] };
    updateActiveAssessment(updated);
  };

  const handleUpdateSection = (updatedSection: Section) => {
    if (!activeAssessment) return;
    const updated = {
      ...activeAssessment,
      sections: activeAssessment.sections.map(s => s.id === updatedSection.id ? updatedSection : s),
    };
    updateActiveAssessment(updated);
  };

  const handleDeleteSection = (sectionIdToDelete: string) => {
    if (!activeAssessment) return;
    const updated = {
      ...activeAssessment,
      sections: activeAssessment.sections.filter(s => s.id !== sectionIdToDelete),
    };
    updateActiveAssessment(updated);
  };

  const handleTitleChange = (newTitle: string) => {
    if (!activeAssessment) return;
    const updated = { ...activeAssessment, title: newTitle };
    updateActiveAssessment(updated);
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Assessment Builder...</div>;
  }
  
  if (!activeAssessment) {
      return <div className="p-8 text-center text-red-500">Could not load or create an assessment.</div>;
  }

  // Flatten all questions from all sections to pass down for conditional logic checks
  const allQuestions = activeAssessment.sections.flatMap(s => s.questions);

  return (
    <div className="flex h-screen bg-gray-100">
     
      <div className="w-1/2 p-8 overflow-y-auto">
        <Link to={`/jobs/${jobId}`} className="text-blue-500 mb-4 inline-block">&larr; Back to Job Details</Link>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Assessment Editor</h1>
          <SaveButton status={saveStatus} isDirty={isDirty} onClick={handleSaveChanges} />
        </div>
        <input
          type="text"
          value={activeAssessment.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Assessment Title"
          className="text-2xl font-semibold w-full p-2 mb-8 bg-transparent border-b-2 focus:outline-none focus:border-blue-500"
        />
        <div className="space-y-6">
          {activeAssessment.sections.map((section) => (
            <SectionEditor 
              key={section.id} 
              section={section} 
              allQuestions={allQuestions} 
              updateSection={handleUpdateSection} 
              deleteSection={() => handleDeleteSection(section.id)} 
            />
          ))}
        </div>
        <button onClick={handleAddSection} className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          + Add Section
        </button>
      </div>
      
    
      <div className="w-1/2 p-8 bg-white border-l overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Live Preview</h2>
        <AssessmentPreview assessment={activeAssessment} />
      </div>
    </div>
  );
};

export default AssessmentBuilder;

