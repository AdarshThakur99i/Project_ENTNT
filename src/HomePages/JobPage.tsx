import React from 'react'
import { useNavigate } from 'react-router-dom'
const JobPage = () => {
    const navigate=useNavigate();
    function handleClick(e:React.MouseEvent<HTMLButtonElement>) {
             navigate('/jobs/jobsList');
    }
  return (
    <div>
      <button onClick={handleClick}>JOB LIST</button>
    </div>
  )
}

export default JobPage
