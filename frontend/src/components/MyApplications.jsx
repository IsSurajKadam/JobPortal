import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  clearAllApplicationErrors,
  resetApplicationSlice,
  deleteApplication,
  fetchJobSeekerApplications,
} from "../store/slices/applicationSlice";
import Spinner from "../components/Spinner";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FiFileText, FiTrash2, FiDownload, FiEye, FiFile } from "react-icons/fi";

const MyApplications = () => {
  const { applications, loading, error, message } = useSelector(
    (state) => state.applications
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchJobSeekerApplications());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
      dispatch(fetchJobSeekerApplications());
    }
  }, [dispatch, error, message]);

  const handleDeleteApplication = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this application?"
    );
    if (confirmDelete) {
      await dispatch(deleteApplication(id));
      dispatch(fetchJobSeekerApplications());
    }
  };

  const handleDownloadApplication = (app) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.setTextColor(40, 53, 147);
    doc.text("Application Details", 14, 20);
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    doc.autoTable({
      startY: 30,
      theme: "grid",
      head: [["Field", "Details"]],
      body: [
        ["Job Title", app.jobInfo.jobTitle],
        ["Company Name", app.jobInfo.CompanyName],
        ["Applicant Name", app.jobSeekerInfo.name],
        ["Email", app.jobSeekerInfo.email],
        ["Phone", app.jobSeekerInfo.phone],
        ["Address", app.jobSeekerInfo.address],
        ["Cover Letter", app.jobSeekerInfo.coverLetter],
        ["Status", app.status],
        ["Deletion Date", new Date(app.jobInfo.expiryDate).toDateString()],
      ],
      styles: {
        cellPadding: 3,
        fontSize: 10,
        valign: "middle",
      },
    });
    doc.save(`Application_${app._id}.pdf`);
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="container mx-auto p-6 max-w-7xl"
    >
      <motion.h3
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="text-3xl font-bold mb-8 text-center text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        My Applications
      </motion.h3>

      {loading ? (
        <div className="flex justify-center p-12">
          <Spinner size="lg" />
        </div>
      ) : applications.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-200 max-w-md mx-auto"
        >
          <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
          <h1 className="text-xl font-semibold text-gray-600 mb-2">
            No Applications Found
          </h1>
          <p className="text-gray-500">
            You haven't applied to any jobs yet. Start exploring opportunities!
          </p>
        </motion.div>
      ) : (
        <motion.div
          className="overflow-x-auto rounded-2xl shadow-xl border border-gray-200 bg-white"
          variants={tableVariants}
          initial="hidden"
          animate="visible"
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                  Job Title
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                  Applicant
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                  Deletion Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700 uppercase tracking-wider border-b-2 border-gray-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <AnimatePresence>
                {applications.map((app) => (
                  <motion.tr
                    key={app._id}
                    variants={rowVariants}
                    className="hover:bg-gray-50 even:bg-gray-50/30"
                    whileHover={{ scale: 1.005 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {app.jobInfo.jobTitle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {app.jobSeekerInfo.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <motion.span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : app.status === "accepted"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {app.status}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                      {new Date(app.jobInfo.expiryDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex flex-col space-y-2 items-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full max-w-[200px] flex items-center justify-center space-x-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
                          onClick={() => window.open(app.jobSeekerInfo.resume?.url, "_blank")}
                        >
                          <FiFile className="w-4 h-4" />
                          <span>View Resume</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full max-w-[200px] flex items-center justify-center space-x-2 bg-purple-50 text-purple-600 px-4 py-2 rounded-lg hover:bg-purple-100 transition-colors"
                          onClick={() => handleDownloadApplication(app)}
                        >
                          <FiDownload className="w-4 h-4" />
                          <span>Download PDF</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full max-w-[200px] flex items-center justify-center space-x-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100 transition-colors"
                          onClick={() => handleDeleteApplication(app._id)}
                        >
                          <FiTrash2 className="w-4 h-4" />
                          <span>Delete Application</span>
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyApplications;