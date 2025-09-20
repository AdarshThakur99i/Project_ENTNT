import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAssessmentsForJob } from '../../api/JobsApi/AssessmentApi';
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


interface AssessmentPreviewProps {
    assessment?: Assessment | null;
}

const AssessmentPreview: React.FC<AssessmentPreviewProps> = ({ assessment: assessmentFromProp }) => {
    const { jobId } = useParams<{ jobId: string }>();
    const [internalAssessment, setInternalAssessment] = useState<Assessment | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        //  Only fetch data if no prop is provided (meaning it's a standalone page)
        if (assessmentFromProp === undefined && jobId) {
            const loadAssessment = async () => {
                setIsLoading(true);
                try {
                    const assessments = await fetchAssessmentsForJob(parseInt(jobId, 10));
                    // Show the first assessment found for the job
                    setInternalAssessment(assessments.length > 0 ? assessments[0] : null);
                } catch (error) {
                    console.error("Failed to load assessment for preview:", error);
                    setInternalAssessment(null);
                } finally {
                    setIsLoading(false);
                }
            };
            loadAssessment();
        } else {
            // If a prop is passed, it's not in a loading state.
            setIsLoading(false);
        }
    }, [jobId, assessmentFromProp]); // Depend on the prop to prevent re-fetching

    // Decide which assessment data to use: the prop (for live preview) or the fetched state (for standalone page)
    const assessment = assessmentFromProp !== undefined ? assessmentFromProp : internalAssessment;
    const isStandalonePage = assessmentFromProp === undefined;

    if (isLoading) {
        return <div className="p-8 text-center text-gray-500">Loading Assessment Preview...</div>;
    }

    if (!assessment) {
        // Show a more helpful message on the standalone page if no assessment exists
        if (isStandalonePage) {
            return (
                <div className="p-8 max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold mb-4">No Assessment Found</h2>
                    <p className="text-gray-600 mb-6">There is no assessment configured for this job.</p>
                    <Link to={`/jobs/${jobId}`} className="text-blue-500 hover:underline">&larr; Back to Job Details</Link>
                </div>
            );
        }
        // Show a simple message when embedded in the builder
        return <div className="p-6 bg-gray-50 rounded-lg">No assessment data to preview.</div>;
    }

    const previewBody = (
        <>
            <h2 className="text-2xl font-bold mb-4">{assessment.title}</h2>
            {assessment.sections.map(section => (
                <div key={section.id} className="mb-6">
                    <h3 className="text-xl font-semibold mb-4 border-b pb-2">{section.title}</h3>
                    {section.questions.map(question => (
                        <PreviewQuestion key={question.id} question={question} />
                    ))}
                </div>
            ))}
        </>
    );

    // Render a full page layout if standalone, or a simple div if embedded
    if (isStandalonePage) {
        return (
            <div className="min-h-screen bg-gray-50 p-8">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <Link to={`/jobs/${jobId}`} className="text-blue-500 hover:underline">&larr; Back to Job Details</Link>
                    </div>
                    <div className="p-8 bg-white rounded-lg border shadow-md">
                        {previewBody}
                    </div>
                </div>
            </div>
        );
    }
    
    // This is the return for the embedded preview in the builder
    return (
        <div className="p-6 bg-gray-50 rounded-lg border">
            {previewBody}
        </div>
    );
};

export default AssessmentPreview;

