import React from 'react';
import { useParams } from 'react-router-dom';
import type { Section } from '../data/AssessmentData/assessment';
import SectionEditor from '../components/AssessmentComponents/SectionEditor';
import { useAssessmentBuilder } from '../hooks/AssessmentHooks/useAssessmentBuilder'; 

const AssessmentBuilder: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { assessment, setAssessment, isLoading } = useAssessmentBuilder(jobId);

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

  const handleTitleChange = (newTitle: string) => {
    if (!setAssessment || !assessment) return;
    setAssessment({ ...assessment, title: newTitle });
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading Assessment...</div>;
  }

  if (!assessment) {
    return <div className="p-8 text-center text-red-500">Error: Could not load assessment. Invalid Job ID.</div>;
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Assessment Builder</h1>
      <input
        type="text"
        value={assessment.title}
        onChange={(e) => handleTitleChange(e.target.value)}
        className="text-2xl font-semibold text-gray-700 border-b-2 w-full p-2 mb-8"
        placeholder="Assessment Title"
      />

      <div className="space-y-6">
        {assessment.sections.map((section) => (
          <SectionEditor
            key={section.id}
            section={section}
            updateSection={handleUpdateSection}
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
  );
};

export default AssessmentBuilder;