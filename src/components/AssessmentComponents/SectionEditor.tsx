import React from 'react';
import type { Section, Question } from '../../data/AssessmentData/assessment';
import QuestionEditor from './QuestionEditor';

interface SectionEditorProps {
  section: Section;
  updateSection: (updatedSection: Section) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({ section, updateSection }) => {
  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      text: 'New Question',
      isRequired: false,
      details: { type: 'short-text' },
    };
    
    const updatedSection = {
      ...section,
      questions: [...section.questions, newQuestion],
    };

    updateSection(updatedSection);
  };
  
  return (
    <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <input
        type="text"
        defaultValue={section.title}
        className="text-xl font-bold text-gray-800 border-b w-full p-1 mb-4"
        placeholder="Section Title"
      />
      
      <div className="pl-4 border-l-2 border-gray-200 space-y-4">
        {section.questions.length > 0 ? (
          section.questions.map(q => <QuestionEditor key={q.id} question={q} />)
        ) : (
          <p className="text-gray-500 italic">No questions in this section yet.</p>
        )}
      </div>
      
      <button
        onClick={handleAddQuestion}
        className="mt-4 px-3 py-1 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-sm"
      >
        + Add Question
      </button>
    </div>
  );
};

export default SectionEditor;