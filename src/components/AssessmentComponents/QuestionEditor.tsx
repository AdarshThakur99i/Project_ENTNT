import React from 'react';
import type { Question } from '../../data/AssessmentData/assessment';

interface QuestionEditorProps {
  question: Question;
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({ question }) => {
  return (
    <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
      <textarea
        defaultValue={question.text}
        placeholder="Type your question here..."
        className="w-full p-2 border rounded-md"
        rows={2}
      />
      <div className="flex items-center justify-between mt-2">
        <select className="p-2 border rounded-md text-sm">
          <option value="short-text">Short Text</option>
          <option value="long-text">Long Text</option>
          <option value="single-choice">Single Choice</option>
          <option value="multi-choice">Multi-choice</option>
          <option value="numeric">Numeric</option>
          <option value="file-upload">File Upload</option>
        </select>
        
        <div className="flex items-center gap-2">
          <label htmlFor={`required-${question.id}`} className="text-sm text-gray-600">
            Required
          </label>
          <input
            type="checkbox"
            id={`required-${question.id}`}
            defaultChecked={question.isRequired}
            className="h-4 w-4"
          />
        </div>
      </div>
    </div>
  );
};

export default QuestionEditor;