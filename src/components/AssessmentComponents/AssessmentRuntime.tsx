import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { loadAssessment, saveAssessmentResponse } from '../../data/AssessmentData/assessment.service';
import type { Assessment, Question } from '../../data/AssessmentData/assessment';

const AssessmentRuntime: React.FC = () => {
  const { jobId, candidateId } = useParams<{ jobId: string, candidateId: string }>();
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if (jobId) {
      setAssessment(loadAssessment(jobId));
    }
  }, [jobId]);

  const onSubmit = (data: any) => {
    if (jobId && candidateId) {
      saveAssessmentResponse(jobId, candidateId, data);
      alert('Assessment submitted successfully!');
    }
  };

  if (!assessment) {
    return <div className="p-8 text-center">Loading Assessment...</div>;
  }

 
  const getQuestionById = (id: string) => assessment.sections.flatMap(s => s.questions).find(q => q.id === id);

  const renderQuestion = (question: Question) => {
  
    if (question.condition) {
      const watchedValue = watch(question.condition.questionId);
      if (watchedValue !== question.condition.value) {
        return null; // Don't render this question
      }
    }
    
    
    const rules: any = {};
    if (question.isRequired) rules.required = 'This field is required';
    if (question.details.type === 'short-text' && question.details.maxLength) rules.maxLength = { value: question.details.maxLength, message: `Max ${question.details.maxLength} characters` };
    if (question.details.type === 'numeric') {
        if (question.details.min !== undefined) rules.min = { value: question.details.min, message: `Minimum value is ${question.details.min}` };
        if (question.details.max !== undefined) rules.max = { value: question.details.max, message: `Maximum value is ${question.details.max}` };
    }

    return (
      <div key={question.id} className="mb-6">
        <label className="block font-semibold mb-2">
          {question.text}
          {question.isRequired && <span className="text-red-500 ml-1">*</span>}
        </label>
        
      
        {question.details.type === 'short-text' && <input {...register(question.id, rules)} className="w-full p-2 border rounded-md" />}
        {question.details.type === 'long-text' && <textarea {...register(question.id, rules)} className="w-full p-2 border rounded-md" rows={4} />}
        {question.details.type === 'numeric' && <input type="number" {...register(question.id, rules)} className="w-full p-2 border rounded-md" />}

        {question.details.type === 'single-choice' && question.details.options.map((opt, i) => (
            <div key={i}><input {...register(question.id, rules)} type="radio" value={opt} id={`${question.id}-${i}`} /><label htmlFor={`${question.id}-${i}`} className="ml-2">{opt}</label></div>
        ))}

        {question.details.type === 'multi-choice' && question.details.options.map((opt, i) => (
            <div key={i}><input {...register(question.id, rules)} type="checkbox" value={opt} id={`${question.id}-${i}`} /><label htmlFor={`${question.id}-${i}`} className="ml-2">{opt}</label></div>
        ))}

        {errors[question.id] && <p className="text-red-500 text-sm mt-1">{errors[question.id]?.message as string}</p>}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{assessment.title}</h1>
      {assessment.sections.map(section => (
        <div key={section.id} className="mb-8 p-6 bg-gray-50 rounded-lg border">
          <h2 className="text-xl font-bold mb-4">{section.title}</h2>
          {section.questions.map(renderQuestion)}
        </div>
      ))}
      <button type="submit" className="w-full px-4 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600">Submit Assessment</button>
    </form>
  );
};

export default AssessmentRuntime;