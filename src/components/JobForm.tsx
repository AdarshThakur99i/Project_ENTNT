import React, { useState, useEffect } from 'react';

const JobForm = ({ isOpen, onClose, onSubmit, initialData, allTags }) => {
  const [formData, setFormData] = useState({
    title: '',
    status: 'active',
    tags: [] as string[],
  });

  
  useEffect(() => {
    console.log('JobForm useEffect - initialData:', initialData, 'isOpen:', isOpen);
    if (initialData) {
      
      const newFormData = {
        ...initialData, 
        tags: Array.isArray(initialData.tags) ? [...initialData.tags] : []
      };
      console.log('Setting form data from initialData:', newFormData);
      setFormData(newFormData);
    } else {
      // Reset to default when creating a new job
      console.log('Resetting form data to default');
      setFormData({ title: '', status: 'active', tags: [] });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagToggle = (tag: string) => {
    console.log('=== TAG TOGGLE START ===');
    console.log('Clicking tag:', tag);
    console.log('Current formData.tags BEFORE:', formData.tags);
    console.log('Is array?', Array.isArray(formData.tags));
    
    setFormData(prevFormData => {
      console.log('Inside setFormData - prevFormData.tags:', prevFormData.tags);
      
      const currentTags = Array.isArray(prevFormData.tags) ? prevFormData.tags : [];
      const isCurrentlySelected = currentTags.includes(tag);
      
      let newTags;
      if (isCurrentlySelected) {
        // Remove the tag
        newTags = currentTags.filter(t => t !== tag);
        console.log('Removing tag. New tags:', newTags);
      } else {
        // Add the tag
        newTags = [...currentTags, tag];
        console.log('Adding tag. New tags:', newTags);
      }
      
      const newFormData = { ...prevFormData, tags: newTags };
      console.log('Final newFormData:', newFormData);
      console.log('=== TAG TOGGLE END ===');
      
      return newFormData;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('JobForm handleSubmit - formData being submitted:', formData);
    onSubmit(formData);
    onClose();
  };

  const isEditMode = !!initialData;

  return (
   
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex justify-center items-center">
   
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-50">
        <h2 className="text-2xl font-bold mb-4">{isEditMode ? 'Edit Job' : 'Create New Job'}</h2>
        
      
        
        <form onSubmit={handleSubmit}>
         
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-semibold mb-2">Job Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
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
              className="w-full p-2 border rounded-md"
            >
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
          </div>
{/* tag selection */}
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">Tags</label>
            <div className="mb-2 text-sm text-gray-600">
              Selected: {formData.tags.length > 0 ? formData.tags.join(', ') : 'None'}
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => {
                const isSelected = Array.isArray(formData.tags) && formData.tags.includes(tag);
                console.log(`Tag "${tag}" selected:`, isSelected, 'Current tags:', formData.tags);
                return (
                  <button
                    type="button"
                    key={`tag-${tag}`}
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1 text-sm rounded-full border-2 transition-all duration-200 ${
                      isSelected 
                        ? 'bg-blue-500 text-white border-blue-600 shadow-md transform scale-105' 
                        : 'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {tag} {isSelected ? '✓' : ''}
                  </button>
                )
              })}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
              {isEditMode ? 'Save Changes' : 'Create Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;