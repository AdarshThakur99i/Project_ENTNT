import React, { useState, useEffect } from 'react';
import type { Job } from '../../data/JobsData/Jobs.types';

interface JobFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: Job | Omit<Job, 'id'>) => void;
    initialData: Job | null;
    allTags: string[];
}

const JobForm: React.FC<JobFormProps> = ({ isOpen, onClose, onSubmit, initialData, allTags }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'active' as 'active' | 'archived',
    tags: [] as string[],
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          ...initialData,
          tags: Array.isArray(initialData.tags) ? [...initialData.tags] : []
        });
      } else {
        setFormData({ title: '', status: 'active', tags: [] });
      }
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    onSubmit(initialData ? { ...formData, id: initialData.id } : formData);
  };

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4">
      <div 
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-50 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Job' : 'Create New Job'}</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="status" className="block text-gray-700 font-semibold mb-2">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => {
                const isSelected = formData.tags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => handleTagToggle(tag)}
                    className={`inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border transition-all duration-200 ${
                      isSelected
                        ? 'bg-slate-800 text-white border-slate-800'
                        : 'bg-teal-400 border-slate-300 hover:bg-slate-50 hover:border-slate-400'
                    }`}
                  >
                    {tag}
                    {isSelected && <span className="ml-1.5 text-white opacity-75">✓</span>}
                  </button>
                )
              })}
            </div>
          </div>
          
          <div className="flex justify-end gap-4 border-t pt-4 mt-6">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
              {isEditMode ? 'Save Changes' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;

