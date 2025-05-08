import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAllJobErrors,
  postJob,
  resetJobSlice,
} from "../store/slices/jobSlice";

const JobPost = () => {
  const [formData, setFormData] = useState({
    title: "",
    jobType: "",
    location: "",
    companyName: "",
    introduction: "",
    responsibilities: "",
    qualifications: "",
    offers: "",
    jobNiche: "",
    salary: "",
    hiringMultipleCandidates: "No",
    personalWebsiteTitle: "",
    personalWebsiteUrl: "",
    validityPeriod: "",
  });

  const dispatch = useDispatch();
  const { error, message } = useSelector((state) => state.jobs);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetJobSlice());
      setFormData({
        title: "",
        jobType: "",
        location: "",
        companyName: "",
        introduction: "",
        responsibilities: "",
        qualifications: "",
        offers: "",
        jobNiche: "",
        salary: "",
        hiringMultipleCandidates: "No",
        personalWebsiteTitle: "",
        personalWebsiteUrl: "",
        validityPeriod: "",
      });
    }
  }, [error, message, dispatch]);

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to calculate expiration date
  const calculateExpireDate = (validity) => {
    let expireDate = new Date();
    if (validity === "3-month") {
      expireDate.setMonth(expireDate.getMonth() + 3);
    } else if (validity === "6-month") {
      expireDate.setMonth(expireDate.getMonth() + 6);
    } else if (validity === "1-year") {
      expireDate.setFullYear(expireDate.getFullYear() + 1);
    }
    return expireDate.toISOString();
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.validityPeriod) {
      toast.error("Please select job validity period.");
      return;
    }

    const jobData = {
      ...formData,
      expiryDate: calculateExpireDate(formData.validityPeriod), // Fixed key name
    };

    dispatch(postJob(jobData));
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg p-8 rounded-lg mt-8 border">
      <h2 className="text-3xl font-semibold mb-6 text-center">Post a Job</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
        {/* Job Title */}
        <div>
          <label className="block font-semibold mb-2">Job Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Job Type */}
        <div>
          <label className="block font-semibold mb-2">Job Type</label>
          <select
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="block font-semibold mb-2">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Company Name */}
        <div>
          <label className="block font-semibold mb-2">Company Name</label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Salary (Number Input) */}
        <div>
          <label className="block font-semibold mb-2">Salary</label>
          <input
            type="number"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Job Validity */}
        <div>
          <label className="block font-semibold mb-2">Job Validity</label>
          <select
            name="validityPeriod"
            value={formData.validityPeriod}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-300"
            required
          >
            <option value="">Select</option>
            <option value="3-month">3 Months</option>
            <option value="6-month">6 Months</option>
            <option value="1-year">1 Year</option>
          </select>
        </div>

        {/* Hiring Multiple Candidates */}
        <div>
          <label className="block font-semibold mb-2">
            Hiring Multiple Candidates?
          </label>
          <select
            name="hiringMultipleCandidates"
            value={formData.hiringMultipleCandidates}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-300"
            required
          >
            <option value="No">No</option>
            <option value="Yes">Yes</option>
          </select>
        </div>

        {/* Job Niche */}
        <div>
          <label className="block font-semibold mb-2">Job Niche</label>
          <input
            type="text"
            name="jobNiche"
            value={formData.jobNiche}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-300"
            required
          />
        </div>

        {/* Introduction */}
        <div className="col-span-2">
          <label className="block font-semibold mb-2">Job Introduction</label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-300"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Responsibilities */}
        <div className="col-span-2">
          <label className="block font-semibold mb-2">Responsibilities</label>
          <textarea
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-300"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Qualifications */}
        <div className="col-span-2">
          <label className="block font-semibold mb-2">Qualifications</label>
          <textarea
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg focus:ring focus:ring-blue-300"
            rows={4}
            required
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="col-span-2 flex justify-center mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Post Job
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobPost;
