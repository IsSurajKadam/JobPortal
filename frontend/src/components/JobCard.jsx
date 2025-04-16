import React from "react";
const JobCard = ({ job }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold">{job.title}</h3>
      <p>{job.company}</p>
      <button className="mt-2 bg-purple-600 text-white px-4 py-2 rounded">
        Apply Now
      </button>
    </div>
  );
};

export default JobCard;
