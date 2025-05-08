import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  scheduleInterview,
  clearInterviewErrors,
} from "../store/slices/interviewSlice";
import { fetchJobs } from "../store/slices/jobSlice";
import { getUser } from "../store/slices/userSlice";
import { fetchApplicationById } from "../store/slices/applicationSlice";
import { motion } from "framer-motion";

const ScheduleInterviewForm = () => {
  const { applicationId, jobId, candidateId } = useParams();
  const dispatch = useDispatch();

  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { jobs } = useSelector((state) => state.jobs);
  const { loading, error, message } = useSelector((state) => state.interviews);
  const { application } = useSelector((state) => state.applications);

  const [candidateEmail, setCandidateEmail] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");

  useEffect(() => {
    if (!isAuthenticated) dispatch(getUser());
    dispatch(fetchJobs());
    dispatch(fetchApplicationById(applicationId));

    if (error) {
      toast.error(error);
      dispatch(clearInterviewErrors());
    }

    if (message) {
      toast.success(message);
      setDateTime("");
      setMeetingLink("");
    }
  }, [dispatch, error, message, isAuthenticated, candidateId]);

  useEffect(() => {
    if (application?.jobSeekerInfo?.email) {
      setCandidateEmail(application.jobSeekerInfo.email);
    }
  }, [application]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!candidateEmail || !jobId || !dateTime || !meetingLink) {
      toast.error("Please fill in all fields.");
      return;
    }
    const selectedDateTime = new Date(dateTime);
    const currentDateTime = new Date();

    const now = new Date(currentDateTime.getTime());
    now.setMilliseconds(0);
    if (selectedDateTime <= now) {
      toast.error("Cannot schedule interview for past dates or times.");
      return;
    }

    dispatch(
      scheduleInterview(applicationId, jobId, candidateId, {
        candidateEmail,
        dateTime,
        meetingLink,
      })
    );
  };

  return (
    <div className="flex flex-col md:flex-row items-start justify-center  gap-8 p-6 ">
      {/* Left Side Box with Dashboard Link */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="w-full md:w-1/3 p-6 rounded-2xl shadow-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white space-y-4 h-[300px] text-center mt-[100px]"
      >
        <h2 className="text-3xl font-bold">Navigation</h2>
        <Link
          to="/dashboard"
          className="block w-full text-center py-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-transform transform hover:scale-105"
        >
          Go to Dashboard
        </Link>
        <p className="text-sm leading-relaxed">
          Use this form to schedule interviews for candidates. Make sure to fill
          out all fields before submitting.
        </p>
      </motion.div>

      {/* Schedule Interview Form */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="w-full md:w-2/3 p-8 bg-white rounded-2xl shadow-2xl space-y-6"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800">
          Schedule Interview
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Candidate Email */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Candidate Email:
            </label>
            <input
              type="email"
              value={candidateEmail}
              readOnly
              className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-medium mb-1">Job Title:</label>
            <input
              type="text"
              value={application?.jobInfo?.jobTitle || ""}
              readOnly
              className="w-full p-3 border rounded-lg bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Date & Time */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Date & Time:
            </label>
            <input
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* Meeting Link */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Meeting Link:
            </label>
            <input
              type="url"
              placeholder="Enter meeting link"
              value={meetingLink}
              onChange={(e) => setMeetingLink(e.target.value)}
              className="w-full p-3 border rounded-lg"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-transform transform hover:scale-105"
          >
            {loading ? "Scheduling..." : "Schedule Interview"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ScheduleInterviewForm;
