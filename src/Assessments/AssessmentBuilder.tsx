import React from 'react';
import { useParams } from 'react-router-dom';
import type { Section } from '../data/AssessmentFunctions/assessment';
import SectionEditor from '../components/AssessmentComponents/SectionEditor';
import AssessmentPreview from '../components/AssessmentComponents/AssessmentPreview';
import { useAssessmentBuilder } from '../hooks/AssessmentHooks/useAssessmentBuilder';

const AssessmentBuilder: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { 
    assessment, 
    setAssessment, 
    isLoading, 
    isDirty, 
    saveChanges, 
    showConfirmation 
  } = useAssessmentBuilder(jobId);

  const handleAddSection = () => {
    if (!setAssessment || !assessment) return;
    const newSection: Section = { id: `sec-${Date.now()}`, title: 'New Section', questions: [] };
    setAssessment({ ...assessment, sections: [...assessment.sections, newSection] });
  };

  const handleUpdateSection = (updatedSection: Section) => {
    if (!setAssessment || !assessment) return;
    setAssessment({
      ...assessment,
      sections: assessment.sections.map(s => s.id === updatedSection.id ? updatedSection : s),
    });
  };

  const handleDeleteSection = (sectionIdToDelete: string) => {
    if (!setAssessment || !assessment) return;
    setAssessment({
      ...assessment,
      sections: assessment.sections.filter(s => s.id !== sectionIdToDelete),
    });
  };

  const handleTitleChange = (newTitle: string) => {
    if (!setAssessment || !assessment) return;
    setAssessment({ ...assessment, title: newTitle });
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading Assessment...</div>;
  }

  if (!assessment) {
    return <div className="p-8 text-center text-red-500">Error: Could not load assessment. Invalid Job ID.</div>;
  }

  // Get a flat list of all questions to pass down for conditional logic
  const allQuestions = assessment.sections.flatMap(s => s.questions);

  return (
    <div className="flex h-screen bg-gray-100 relative">
      <div className="w-1/2 p-8 overflow-y-auto">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold">Assessment Builder</h1>
          <div className="flex items-center gap-4">
            {isDirty && <span className="text-sm text-yellow-600 italic">Unsaved changes</span>}
            <button
              onClick={saveChanges}
              disabled={!isDirty}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Save Assessment
            </button>
          </div>
        </div>
        <input
          type="text"
          value={assessment.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="text-2xl font-semibold text-gray-700 bg-transparent border-b-2 w-full p-2 mb-8 focus:outline-none focus:border-blue-500"
          placeholder="Assessment Title"
        />
        <div className="space-y-6">
          {assessment.sections.map((section) => (
            <SectionEditor
              key={section.id}
              section={section}
              allQuestions={allQuestions} 
              updateSection={handleUpdateSection}
              deleteSection={() => handleDeleteSection(section.id)}
            />
          ))}
        </div>
        <button
          onClick={handleAddSection}
          className="mt-8 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          + Add Section
        </button>
      </div>

      <div className="w-1/2 p-8 bg-white border-l overflow-y-auto">
        <AssessmentPreview assessment={assessment} />
      </div>

      {showConfirmation && (
        <div className="absolute top-6 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg transition-opacity duration-300">
          Assessment Saved!
        </div>
      )}
    </div>
  );
};

export default AssessmentBuilder;