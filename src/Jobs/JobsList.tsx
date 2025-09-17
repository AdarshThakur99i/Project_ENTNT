import React from 'react'
import {useState} from "react";
const JobsList = () => {
    const [jobs, setJobs] = useState([
  { id: 1, title: "Frontend Developer", status: "active" },
  { id: 2, title: "Backend Developer", status: "archived" },
  { id: 3, title: "DevOps Engineer", status: "active" },
]);
//    const [archiveState,setArchiveState]=useState("Archive");
   function handleArchive(id:number) {
             setJobs((prevJobs)=> 
               prevJobs.map((job) => 
                     job.id===id ?
                     {
                        ...job,
                       status:job.status==='active'?'archived':'active'
                     }
                     : job
               )
             )
   }
  return (
    <div>
      {jobs.map((job)=> (
        <div key={job.id}>
            <h2 key={job.id}>JOB Name: {job.title}</h2>
            <button onClick={() => handleArchive(job.id)}> {job.status=='active' ? 'archive': 'activate'} </button>
     </div> ))}
    </div>
  )
}

export default JobsList
