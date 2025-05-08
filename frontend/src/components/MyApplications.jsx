import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  clearAllApplicationErrors,
  resetApplicationSlice,
  deleteApplication,
  fetchJobSeekerApplications,
} from "../store/slices/applicationSlice";
import Spinner from "../components/Spinner";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaFile, FaTrash, FaDownload } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const MyApplications = () => {
  const dispatch = useDispatch();
  const { applications, loading, error, message } = useSelector(
    (state) => state.applications
  );

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
    const confirm = window.confirm("Are you sure you want to delete this application?");
    if (confirm) {
      await dispatch(deleteApplication(id));
      dispatch(fetchJobSeekerApplications());
    }
  };

  const handleDownloadApplication = (app) => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Application Details", 14, 20);
    doc.setFontSize(12);
    doc.autoTable({
      startY: 30,
      head: [["Field", "Details"]],
      body: [
        ["Job Title", app.jobInfo.jobTitle],
        ["Company", app.jobInfo.CompanyName],
        ["Name", app.jobSeekerInfo.name],
        ["Email", app.jobSeekerInfo.email],
        ["Phone", app.jobSeekerInfo.phone],
        ["Address", app.jobSeekerInfo.address],
        ["Cover Letter", app.jobSeekerInfo.coverLetter],
        ["Status", app.status],
        ["Deletion Date", new Date(app.jobInfo.expiryDate).toLocaleDateString()],
      ],
    });
    doc.save(`Application_${app._id}.pdf`);
  };

  return (
    <div className="container mx-auto p-4">
      <motion.h1
        className="text-3xl font-bold text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        My Applications
      </motion.h1>

      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      ) : applications.length === 0 ? (
        <motion.div
          className="text-center text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No applications found.
        </motion.div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
              <thead className="bg-[#f0f6ff]">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Job Title</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Applicant</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-center">Status</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-center">Deletion Date</th>
                  <th className="px-6 py-3 text-sm font-semibold text-gray-700 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {applications.map((app, index) => (
                    <motion.tr
                      key={app._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white even:bg-gray-50"
                    >
                      <td className="px-6 py-4">{app.jobInfo.jobTitle}</td>
                      <td className="px-6 py-4">{app.jobSeekerInfo.name}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            app.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : app.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {new Date(app.jobInfo.expiryDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2 items-center">
                          {[["View Resume", FaFile, () => window.open(app.jobSeekerInfo.resume?.url, "_blank")],
                            ["Download PDF", FaDownload, () => handleDownloadApplication(app)],
                            ["Delete", FaTrash, () => handleDeleteApplication(app._id)]].map(([label, Icon, action], i) => (
                            <motion.button
                              key={label}
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={action}
                              className={`${
                                label === "Delete"
                                  ? "bg-red-100 hover:bg-red-200 text-red-600"
                                  : "bg-[#f0f6ff] hover:bg-[#dcecff] text-[#007bff]"
                              } font-medium py-2 px-4 rounded-md flex items-center gap-2 w-full max-w-[180px]`}
                            >
                              <Icon /> {label}
                            </motion.button>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="sm:hidden space-y-6">
            <AnimatePresence>
              {applications.map((app) => (
                <motion.div
                  key={app._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white shadow-md rounded-lg p-4 border"
                >
                  <h2 className="text-lg font-semibold">{app.jobInfo.jobTitle}</h2>
                  <p className="text-sm text-gray-600">Applicant: {app.jobSeekerInfo.name}</p>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        app.status === "pending"
                          ? "text-yellow-600"
                          : app.status === "accepted"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Deletion Date: {new Date(app.jobInfo.expiryDate).toLocaleDateString()}
                  </p>

                  <div className="mt-4 space-y-2">
                    {[["View Resume", FaFile, () => window.open(app.jobSeekerInfo.resume?.url, "_blank")],
                      ["Download PDF", FaDownload, () => handleDownloadApplication(app)],
                      ["Delete", FaTrash, () => handleDeleteApplication(app._id)]].map(([label, Icon, action]) => (
                      <motion.button
                        key={label}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={action}
                        className={`${
                          label === "Delete"
                            ? "bg-red-100 hover:bg-red-200 text-red-600"
                            : "bg-[#f0f6ff] hover:bg-[#dcecff] text-[#007bff]"
                        } font-medium py-2 px-4 rounded-md w-full flex items-center justify-center gap-2`}
                      >
                        <Icon /> {label}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </div>
  );
};

export default MyApplications;
