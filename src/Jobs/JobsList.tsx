import React, { useState, useRef } from "react";

const JobsList: React.FC = () => {
  const [jobs, setJobs] = useState([
    { id: 1, title: "Frontend Developer", status: "active" },
    { id: 2, title: "Backend Developer", status: "archived" },
    { id: 3, title: "DevOps Engineer", status: "active" },
  ]);

  // Refs to store the index of the item being dragged and the item being dragged over
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  function handleArchive(id: number) {
    setJobs((prevJobs) =>
      prevJobs.map((job) =>
        job.id === id
          ? { ...job, status: job.status === "active" ? "archived" : "active" }
          : job
      )
    );
  }

 
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };

  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  

  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };

  // Function to handle the drop, which reorders the list
  const handleDrop = () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    // Create a new array to avoid mutating state directly
    const newJobs = [...jobs];
    
    // Remove the dragged item from its original position
    const draggedItemContent = newJobs.splice(dragItem.current, 1)[0];
    
    // Insert the dragged item into the new position
    newJobs.splice(dragOverItem.current, 0, draggedItemContent);

    // Reset the refs
    dragItem.current = null;
    dragOverItem.current = null;

    // Update the state with the new, reordered array
    setJobs(newJobs);
  };

  return (
    <div className="p-4 text-left max-w-4xl mx-auto">
      {jobs.map((job, index) => (
        <div
          key={job.id}
          className="border rounded-lg p-4 shadow-md mb-4 cursor-move"
          draggable 
          onDragStart={() => handleDragStart(index)}
          onDragEnter={() => handleDragEnter(index)}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onDragEnd={handleDrop} 
        >
          <div className="flex items-center justify-between flex-wrap">
            <h2
              className={`text-lg font-semibold truncate transition-opacity duration-500 ${
                job.status === "archived" ? "opacity-50" : "opacity-100"
              }`}
            >
              JOB Name: {job.title}
            </h2>
            <button
              className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2 md:mt-0 ${
                job.status === "archived" ? "opacity-70" : "opacity-100"
              }`}
              onClick={() => handleArchive(job.id)}
            >
              {job.status === "active" ? "Archive" : "Activate"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobsList;