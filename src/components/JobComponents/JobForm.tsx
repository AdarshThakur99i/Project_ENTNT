import React, { useState, useEffect } from 'react';


 import type { Job,JobStatus } from '@/data/JobsData/Jobs.types';

interface JobFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: Job | Omit<Job, 'id'>) => void;
  initialData: Job | null;
  allTags: string[];
}

const defaultFormData: Omit<Job, 'id'> = {
  title: '',
  status: 'active',
  tags: [],
  order: 0,
};

const JobForm: React.FC<JobFormProps> = ({ isOpen, onClose, onSubmit, initialData, allTags }) => {
  const [formData, setFormData] = useState<Omit<Job, 'id'>>(defaultFormData);

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
       
        const { id, ...initialFormData } = initialData;
        setFormData(initialFormData);
      } else {
        setFormData(defaultFormData);
      }
    }
  }, [initialData, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => {
      // Handle different input types appropriately
      let processedValue: string | number = value;
      
      if (type === 'number') {
        processedValue = Number(value);
      }
      
      return {
        ...prev,
        [name]: name === 'status' ? value as JobStatus : processedValue,
      };
    });
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => {
      const currentTags = prev.tags;
      const newTags = currentTags.includes(tag)
        ? currentTags.filter(t => t !== tag)
        : [...currentTags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure all required fields have values
    const submitData = {
      title: formData.title || '',
      status: formData.status || 'active',
      tags: formData.tags || [],
      order: formData.order || 0,
    };
    
    if (initialData) {
      onSubmit({ ...submitData, id: initialData.id });
    } else {
      onSubmit(submitData);
    }
  };

  if (!isOpen) return null;

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4">
  <div 
    className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-lg shadow-xl w-full max-w-md z-50 transform transition-all"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
        {isEditMode ? 'Edit Job' : 'Create New Job'}
      </h2>
      <button onClick={onClose} className="text-gray-400 dark:text-gray-300 hover:text-gray-600 dark:hover:text-gray-100 text-2xl">
        &times;
      </button>
    </div>

    <form onSubmit={handleSubmit}>
      {/* Title */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="title">
          Job Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          required
        />
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          <option value="active">Active</option>
          <option value="archive">Archive</option>
          
        </select>
      </div>

      {/* Tags */}
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleTagToggle(tag)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                formData.tags.includes(tag)
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4 border-t border-gray-200 dark:border-gray-700 pt-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white font-semibold rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
        >
          {isEditMode ? 'Save Changes' : 'Create Job'}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default JobForm;