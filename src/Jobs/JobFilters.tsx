import React from 'react';

interface JobFiltersProps {
  filters: { title: string; status: string; tags: string[] };
  allTags: string[];
  onFilterChange: (filterName: 'title' | 'status' | 'tags', value: any) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ filters, allTags, onFilterChange }) => {
  const handleTagClick = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter((t) => t !== tag)
      : [...filters.tags, tag];
    
    onFilterChange('tags', newTags);
  };

  const clearAllTags = () => {
    onFilterChange('tags', []);
  };

  const selectAllTags = () => {
    onFilterChange('tags', [...allTags]);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md mb-8 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
     
        <input
          type="text"
          placeholder="Filter by title..."
          value={filters.title}
          onChange={(e) => onFilterChange('title', e.target.value)}
          className="p-2 border rounded-md"
        />
        
     
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      
     
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700">
            Filter by Tags: 
            {filters.tags.length > 0 && (
              <span className="text-sm font-normal text-blue-600 ml-1">
                ({filters.tags.length} selected)
              </span>
            )}
          </h3>
          
        
          <div className="flex gap-2">
            {filters.tags.length > 0 && (
              <button
                onClick={clearAllTags}
                className="text-xs px-2 py-1 text-red-600 hover:text-red-800 underline"
              >
                Clear All
              </button>
            )}
         
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isSelected = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 text-sm rounded-full transition-all duration-200 transform hover:scale-105 ${
                  isSelected
                    ? 'bg-blue-500 text-white shadow-md ring-2 ring-blue-300'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tag}
                {isSelected && (
                  <span className="ml-1 text-xs opacity-80">✓</span>
                )}
              </button>
            );
          })}
        </div>
        
     
        {filters.tags.length > 0 && (
          <div className="mt-3 p-2 bg-blue-50 rounded-md border border-blue-200">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Active filters:</span> {filters.tags.join(', ')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobFilters;