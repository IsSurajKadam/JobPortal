import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchSingleJob } from "../store/slices/jobSlice";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FaBuilding,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaBriefcase,
} from "react-icons/fa";
// Import your report action (make sure to create a reportSlice accordingly)
import { submitReport, clearReportErrors,clearMessage,resetReportState } from "../store/slices/reportSlice";
import UserNotAuthenticated from "./UserNotAuthenticated";

const fadeIn = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const JobDetails = () => {
  const dispatch = useDispatch();
  const { jobId } = useParams();
  const { singleJob, loading, error } = useSelector((state) => state.jobs);
  const {
    loading: reportLoading,
    error: reportError,
    message: reportMessage,
  } = useSelector((state) => state.report);

  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState("");

  useEffect(() => {
    dispatch(fetchSingleJob(jobId));
  }, [dispatch, jobId]);

  useEffect(() => {
    if (reportError) {
      toast.error(reportError);
      dispatch(clearReportErrors());
    }
    if (reportMessage) {
      toast.success(reportMessage);
      dispatch(clearMessage())
      dispatch(resetReportState())
      setIsReportModalOpen(false);
      setReportReason("");
      dispatch(clearReportErrors());
    }
  }, [reportError, reportMessage, dispatch]);

  if (loading)
    return <Loader className="mx-auto mt-10 animate-spin" size={48} />;
  // if (error) return <p className="text-red-500 text-center text-5xl">{error}</p>;
  if (error) return <UserNotAuthenticated />;

  const handleReportSubmit = (e) => {
    e.preventDefault();
    if (!reportReason.trim()) {
      toast.error("Please provide a reason for reporting this job.");
      return;
    }
    const reportData = {
      jobTitle: singleJob.title,
      companyName: singleJob.companyName,
      reason: reportReason,
      employerId: singleJob.postedBy, // Assumes that jobDetails.postedBy holds employer id
      // reportedBy will be determined by backend from the auth token
    };

    dispatch(submitReport({ jobId: singleJob._id, reason: reportReason }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {}
      {/* Hero Section */}
      <motion.div
        className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-6 rounded-b-3xl shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h1 className="text-4xl font-extrabold text-center">
          {singleJob.title}
        </h1>
        <p className="text-lg text-center mt-2">
          {singleJob.companyName} - {singleJob.location}
        </p>
      </motion.div>

      {/* Job Information Section */}
      <motion.div
        className="max-w-5xl mx-auto p-6 mt-10 bg-white shadow-xl rounded-2xl"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Job Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-gray-800 text-center">
          <div className="p-4 bg-blue-50 rounded-lg shadow-md">
            <FaBuilding className="text-blue-500 text-2xl mx-auto" />
            <p className="mt-2 font-semibold">{singleJob.companyName}</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg shadow-md">
            <FaMapMarkerAlt className="text-green-500 text-2xl mx-auto" />
            <p className="mt-2 font-semibold">{singleJob.location}</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg shadow-md">
            <FaMoneyBillWave className="text-yellow-500 text-2xl mx-auto" />
            <p className="mt-2 font-semibold">₹{singleJob.salary} per year</p>
          </div>
          <div className="p-4 bg-red-50 rounded-lg shadow-md">
            <FaBriefcase className="text-red-500 text-2xl mx-auto" />
            <p className="mt-2 font-semibold">{singleJob.jobType}</p>
          </div>
        </div>

        {/* Job Description */}
        <motion.div className="mt-10" variants={fadeIn}>
          <h2 className="text-2xl font-semibold text-gray-900">
            Job Description
          </h2>
          <p className="text-gray-700 mt-3">{singleJob.introduction}</p>
        </motion.div>

        {/* Responsibilities & Qualifications */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <motion.div
            className="bg-gray-100 p-6 rounded-xl shadow-md"
            variants={fadeIn}
          >
            <h3 className="text-xl font-semibold text-gray-900">
              Responsibilities
            </h3>
            <ul className="list-disc list-inside mt-3 text-gray-600">
              {singleJob.responsibilities ? (
                singleJob.responsibilities
                  .split(",")
                  .map((item, index) => <li key={index}>{item.trim()}</li>)
              ) : (
                <li>No responsibilities listed.</li>
              )}
            </ul>
          </motion.div>
          <motion.div
            className="bg-gray-100 p-6 rounded-xl shadow-md"
            variants={fadeIn}
          >
            <h3 className="text-xl font-semibold text-gray-900">
              Qualifications
            </h3>
            <ul className="list-disc list-inside mt-3 text-gray-600">
              {singleJob.qualifications ? (
                singleJob.qualifications
                  .split(",")
                  .map((item, index) => <li key={index}>{item.trim()}</li>)
              ) : (
                <li>No qualifications listed.</li>
              )}
            </ul>
          </motion.div>
        </div>

        {/* Additional Info */}
        <motion.div
          className="mt-10 bg-gray-100 p-6 rounded-xl shadow-md"
          variants={fadeIn}
        >
          <p className="text-gray-800">
            <strong>Hiring Multiple Candidates:</strong>{" "}
            {singleJob.hiringMultipleCandidates}
          </p>
          <p className="text-gray-800 mt-2">
            <strong>Job Niche:</strong> {singleJob.jobNiche}
          </p>
          <p className="text-gray-800 mt-2">
            <strong>Posted On:</strong>{" "}
            {new Date(singleJob.jobPostedOn).toDateString()}
          </p>
          <p className="text-gray-800 mt-2">
            <strong>Expiry On:</strong>{" "}
            {new Date(singleJob.expiryDate).toDateString()}
          </p>
          <div className="text-right">
            <Button
              variant="destructive"
              onClick={() => setIsReportModalOpen(true)}
              className="bg-gradient-to-r from-blue-500 to-indigo-600"
            >
              Report Job
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Report Job Modal */}
      {isReportModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
        >
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h3 className="text-2xl font-semibold mb-4">Report Job</h3>
            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <Label>Job Title</Label>
                <Input
                  type="text"
                  value={singleJob.title}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label>Company Name</Label>
                <Input
                  type="text"
                  value={singleJob.companyName}
                  disabled
                  className="bg-gray-100"
                />
              </div>
              <div>
                <Label>Reason for Report</Label>
                <textarea
                  className="w-full border rounded p-2"
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Enter your reason for reporting this job"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                  onClick={() => setIsReportModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  disabled={reportLoading}
                >
                  {reportLoading ? "Submitting..." : "Submit Report"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default JobDetails;
