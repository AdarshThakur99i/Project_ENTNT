import React, { useState } from 'react';
import { MentionsInput, Mention } from 'react-mentions';
import { MENTIONABLE_USERS } from '../../data/CandidatesData/mockUsers';
import './mentionStyles.css';

interface NoteInputProps {
  onSave: (noteText: string) => void;
}

const NoteInput: React.FC<NoteInputProps> = ({ onSave }) => {
  const [text, setText] = useState('');

  const handleSave = () => {
    if (text.trim()) {
      onSave(text);
      setText('');
    }
  };

  const userSuggestions = MENTIONABLE_USERS.map(user => ({
    id: user.id,
    display: user.name,
  }));

  return (
    <div className="mt-4 flex gap-2 items-end">
      <div className="flex-grow">
        <MentionsInput
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add a note... mention a user with @"
          className="mentions"
        >
          <Mention
            trigger="@"
            data={userSuggestions}
            markup="@[__display__](__id__)"
            displayTransform={(_id, display) => `@${display}`}
          />
        </MentionsInput>
      </div>
      
    
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 relative z-20 self-stretch" // self-stretch makes button fill vertical space
      >
        Save Note
      </button>
    </div>
  );
};

export default NoteInput;