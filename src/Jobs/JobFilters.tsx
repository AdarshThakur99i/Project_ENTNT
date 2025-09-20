import React from 'react';

interface JobFiltersProps {
  filters: {
    search: string;
    status: string;
    tags: string[]; 
  };
  allTags: string[];
  onFilterChange: (filterName: 'search' | 'status' | 'tags', value: any) => void;
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

  return (
    <div className="py-6 border-y border-gray-200 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <input
              type="text"
              placeholder="Search by title..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="w-full p-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
        </div>
        
        <select
          value={filters.status}
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
      </div>
      
      <div className="mt-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-700 text-sm">Tags</h3>
          {filters.tags.length > 0 && (
            <button
              onClick={clearAllTags}
              className="text-sm font-semibold px-3 py-1.5 text-blue-500 hover:bg-blue-100 rounded-full transition-colors"
            >
              Clear All
            </button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => {
            const isSelected = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`inline-flex items-center px-3 py-1.5 text-sm font-semibold rounded-full border transition-all duration-200 ${
                  isSelected
                    ? 'bg-gray-600 text-white border-blue-500'
                    : 'bg-gray-400 text-gray-900 border-gray-200 hover:bg-gray-200'
                }`}
              >
                {tag}
                {isSelected && <span className="ml-1.5 text-white opacity-75">✓</span>}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default JobFilters;