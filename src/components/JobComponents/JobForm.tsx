import { useState, useEffect } from 'react';

type JobStatus = 'active' | 'inactive';

interface Job {
  id: number;
  title: string;
  status: JobStatus;
  tags: string[];
  order: number;
}

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
        // Remove the id property when using initial data
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
        className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md z-50 transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {isEditMode ? 'Edit Job' : 'Create New Job'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Job Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.tags.includes(tag)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="order">
              Order
            </label>
            <input
              id="order"
              name="order"
              type="number"
              value={formData.order}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
            />
          </div>
          
          <div className="flex justify-end gap-4 border-t pt-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-gray-800 font-semibold rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors"
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