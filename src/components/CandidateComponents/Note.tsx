import React from 'react';

interface NoteProps {
  text: string;
  timestamp: string;
  onDelete: () => void; 
}

const Note: React.FC<NoteProps> = ({ text, timestamp, onDelete }) => {
 
  const renderTextWithMentions = (noteText: string) => {
    const mentionRegex = /@\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = noteText.split(mentionRegex);

    return parts.map((part, index) => {
      if (index % 3 === 1) { 
        return (
          <span key={index} className="font-semibold bg-blue-100 text-blue-800 rounded px-1 py-0.5">
            @{part}
          </span>
        );
      }
     
      if (index % 3 === 0) {
        return part;
      }

      return null; 
    });
  };

  return (
    <div className="group bg-white p-4 rounded-lg border border-gray-200 transition-shadow duration-200 hover:shadow-md relative">
  
      <button
        onClick={onDelete}
        className="absolute top-2 right-2 p-1 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Delete note"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

     
      <p className="text-gray-700 whitespace-pre-wrap">{renderTextWithMentions(text)}</p>
    
      <p className="text-xs text-gray-400 mt-2">
        {new Date(timestamp).toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short',
        })}
      </p>
    </div>
  );
};

export default Note;