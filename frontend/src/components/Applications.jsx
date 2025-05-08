import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  clearAllApplicationErrors,
  deleteApplication,
  fetchEmployerApplications,
  resetApplicationSlice,
  updateApplicationStatus,
} from "../store/slices/applicationSlice";
import Spinner from "./Spinner";
import { FiTrash2, FiFileText, FiCalendar, FiUser, FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Applications = () => {
  const { applications, loading, error, message } = useSelector(
    (state) => state.applications
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
    dispatch(fetchEmployerApplications());
  }, [dispatch, error, message]);

  const handleStatusChange = async (event, id) => {
    const newStatus = event.target.value;
    await dispatch(updateApplicationStatus(id, newStatus));
  };

  const handleDeleteApplication = (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      dispatch(deleteApplication(id));
    }
  };

  const handleScheduleInterview = (applicationId, jobId, candidateId) => {
    navigate(`/schedule/${applicationId}/${jobId}/${candidateId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 w-full"
    >
      <motion.h3
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        Job Applications
      </motion.h3>
  
      {loading ? (
        <div className="flex justify-center p-12">
          <Spinner size="lg" />
        </div>
      ) : applications?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl border-2 border-dashed border-gray-200"
        >
          <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-xl font-semibold text-gray-600">No Applications Found</p>
          <p className="text-gray-500 mt-2">Applications will appear here when candidates apply</p>
        </motion.div>
      ) : (
        <>
          {/* Table for md+ */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <tr>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Job Title</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Applicant</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Contact</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Status</th>
                    <th className="p-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {applications.map((app) => (
                      <motion.tr
                        key={app._id}
                        variants={rowVariants}
                        className="border-t border-gray-100 hover:bg-gray-50"
                        whileHover={{ scale: 1.005 }}
                      >
                        <td className="p-4 font-medium text-gray-900">{app.jobInfo.jobTitle}</td>
                        <td className="p-4 flex items-center"><FiUser className="mr-2" />{app.jobSeekerInfo.name}</td>
                        <td className="p-4 space-y-1">
                          <div className="flex items-center"><FiMail className="mr-2" />{app.jobSeekerInfo.email}</div>
                          <div className="flex items-center"><FiPhone className="mr-2" />{app.jobSeekerInfo.phone}</div>
                        </td>
                        <td className="p-4 flex items-center"><FiMapPin className="mr-2" />{app.jobSeekerInfo.address}</td>
                        <td className="p-4 text-center">
                          <select
                            onChange={(e) => handleStatusChange(e, app._id)}
                            value={app.status}
                            className={`px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                              app.status === "pending" 
                                ? "bg-amber-100 text-amber-800 hover:bg-amber-200" 
                                : app.status === "accepted" 
                                ? "bg-green-100 text-green-800 hover:bg-green-200" 
                                : "bg-red-100 text-red-800 hover:bg-red-200"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col gap-2 items-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full max-w-[160px] flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                              onClick={() => handleDeleteApplication(app._id)}
                            >
                              <FiTrash2 className="mr-2" />
                              Delete
                            </motion.button>
                            {app.jobSeekerInfo?.resume?.url && (
                              <a
                                href={app.jobSeekerInfo.resume.url}
                                className="w-full max-w-[160px] flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <FiFileText className="mr-2" />
                                Resume
                              </a>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full max-w-[160px] flex items-center justify-center px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                              onClick={() => handleScheduleInterview(app._id, app.jobInfo.jobId, app.jobSeekerInfo.id)}
                            >
                              <FiCalendar className="mr-2" />
                              Schedule
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
  
          {/* Cards for mobile */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="md:hidden space-y-6"
          >
            {applications.map((app) => (
              <motion.div
                key={app._id}
                variants={rowVariants}
                className="p-4 rounded-2xl shadow-sm border border-gray-200 bg-white"
              >
                <h4 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                  <FiFileText className="mr-2 text-blue-500" />
                  {app.jobInfo.jobTitle}
                </h4>
                <p className="text-sm text-gray-600 flex items-center">
                  <FiUser className="mr-2" /> {app.jobSeekerInfo.name}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <FiMail className="mr-2" /> {app.jobSeekerInfo.email}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <FiPhone className="mr-2" /> {app.jobSeekerInfo.phone}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <FiMapPin className="mr-2" /> {app.jobSeekerInfo.address}
                </p>
                <div className="mt-3">
                  <select
                    onChange={(e) => handleStatusChange(e, app._id)}
                    value={app.status}
                    className={`w-full px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                      app.status === "pending" 
                        ? "bg-amber-100 text-amber-800 hover:bg-amber-200" 
                        : app.status === "accepted" 
                        ? "bg-green-100 text-green-800 hover:bg-green-200" 
                        : "bg-red-100 text-red-800 hover:bg-red-200"
                    }`}
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                    onClick={() => handleDeleteApplication(app._id)}
                  >
                    <FiTrash2 className="mr-2" />
                    Delete
                  </motion.button>
                  {app.jobSeekerInfo?.resume?.url && (
                    <a
                      href={app.jobSeekerInfo.resume.url}
                      className="w-full flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiFileText className="mr-2" />
                      Resume
                    </a>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full flex items-center justify-center px-4 py-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                    onClick={() => handleScheduleInterview(app._id, app.jobInfo.jobId, app.jobSeekerInfo.id)}
                  >
                    <FiCalendar className="mr-2" />
                    Schedule
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </>
      )}
    </motion.div>
  );
  
};

export default Applications;