import React, { useState, useRef } from "react";



// simulaating async calls to db with some failure rate for testing 
const saveOrderToDB = async (jobs: any[]): Promise<void> => {
  console.log("Attempting to save new order to DB...");
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.05) {
        console.log("Success: Order saved to DB.");
        resolve();
      } else {
        console.error("Failure: Could not save order to DB.(because of intentional 5% error produced to test rollback and optimistic update feature)");
        reject(new Error("Database write failed!"));
      }
    }, 1000); 
  });
};



const JobsList: React.FC = () => {
  const [jobs, setJobs] = useState([
    { id: 1, title: "Frontend Developer", status: "active" },
    { id: 2, title: "Backend Developer", status: "archived" },
    { id: 3, title: "DevOps Engineer", status: "active" },
  ]);

  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

 
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };
  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };


  
  const handleDrop = async () => {
    if (dragItem.current === null || dragOverItem.current === null) return;

    // saving the original state for potential rollback
    const originalJobs = [...jobs];

    
    const newJobs = [...originalJobs];
    const draggedItemContent = newJobs.splice(dragItem.current, 1)[0];
    newJobs.splice(dragOverItem.current, 0, draggedItemContent);

    //updating ui immediately
    setJobs(newJobs);

    // refs resettting
    dragItem.current = null;
    dragOverItem.current = null;

    try {
      
      await saveOrderToDB(newJobs);
    } catch (error) {
      //  on failure  roll back to the original state
      console.log("Rolling back UI change.");
      alert("Error: Could not save. Reverting changes(this is developer generated because of intentional 5% error produced in code  to test rollback and optimistic update features).");
      setJobs(originalJobs);
    }
  };
  
  
  const handleArchive = async (id: number) => {

    const originalJobs = [...jobs];

   
    const updatedJobs = originalJobs.map(job =>
      job.id === id
        ? { ...job, status: job.status === "active" ? "archived" : "active" }
        : job
    );
    setJobs(updatedJobs);

    try {
      console.log("Simulating archive/unarchive save...");
      await new Promise(res => setTimeout(res, 500)); 
    } catch (error) {

      alert("Error: Could not update job status. Reverting.");
      setJobs(originalJobs);
    }
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
                job.status === "archived" ? "opacity-100" : "opacity-70"
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