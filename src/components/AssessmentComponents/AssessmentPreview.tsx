import React from 'react';
import type { Assessment, Section, Question, QuestionDetails } from '../../data/AssessmentFunctions/assessment';

const PreviewSingleChoice: React.FC<{ question: Question }> = ({ question }) => {
  if (question.details.type !== 'single-choice') return null;
  return (
    <div className="space-y-2">
      {question.details.options.map((option, index) => (
        <div key={index} className="flex items-center">
          <input type="radio" id={`${question.id}-${index}`} name={question.id} disabled className="mr-2" />
          <label htmlFor={`${question.id}-${index}`}>{option}</label>
        </div>
      ))}
    </div>
  );
};

const PreviewMultiChoice: React.FC<{ question: Question }> = ({ question }) => {
  if (question.details.type !== 'multi-choice') return null;
  return (
    <div className="space-y-2">
      {question.details.options.map((option, index) => (
        <div key={index} className="flex items-center">
          <input type="checkbox" id={`${question.id}-${index}`} disabled className="mr-2" />
          <label htmlFor={`${question.id}-${index}`}>{option}</label>
        </div>
      ))}
    </div>
  );
};
const PreviewQuestion: React.FC<{ question: Question }> = ({ question }) => {
  const renderQuestionDetails = (details: QuestionDetails) => {
    switch (details.type) {
      case 'single-choice':
        return <PreviewSingleChoice question={question} />;
      case 'multi-choice':
        return <PreviewMultiChoice question={question} />;
      case 'short-text':
        return <input type="text" disabled className="w-full p-2 border rounded-md bg-gray-100" />;
      case 'long-text':
        return <textarea disabled className="w-full p-2 border rounded-md bg-gray-100" rows={4} />;
      case 'numeric':
        return <input type="number" disabled className="w-full p-2 border rounded-md bg-gray-100" />;
      case 'file-upload':
        return <input type="file" disabled className="w-full p-2 border rounded-md bg-gray-100" />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-2">
        {question.text}
        {question.isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderQuestionDetails(question.details)}
    </div>
  );
};

const AssessmentPreview: React.FC<{ assessment: Assessment | null }> = ({ assessment }) => {
  if (!assessment) {
    return <div className="p-6 bg-gray-50 rounded-lg">Loading Preview...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg border">
      <h2 className="text-2xl font-bold mb-4">{assessment.title}</h2>
      {assessment.sections.map(section => (
        <div key={section.id} className="mb-6">
          <h3 className="text-xl font-semibold mb-4 border-b pb-2">{section.title}</h3>
          {section.questions.map(question => (
            <PreviewQuestion key={question.id} question={question} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default AssessmentPreview;