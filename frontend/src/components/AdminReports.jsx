import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  getAllReports,
  updateReportStatus,
  clearReportErrors,
  clearMessage,
} from "../store/slices/reportSlice";

const AdminReports = () => {
  const dispatch = useDispatch();
  const { reports, loading, error, message } = useSelector(
    (state) => state.report
  );
  const [statusUpdates, setStatusUpdates] = useState({});

  // Fetch all reports when component mounts
  useEffect(() => {
    dispatch(getAllReports());
  }, [dispatch]);
  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  // Listen for error and message changes
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearReportErrors());
    }
    if (message) {
      toast.success(message);
    }
  }, [error, message, dispatch]);

  // Handle dropdown change for each report
  const handleStatusChange = (reportId, newStatus) => {
    setStatusUpdates((prev) => ({
      ...prev,
      [reportId]: newStatus,
    }));
  };

  // Trigger update action
  const handleUpdateStatus = (reportId) => {
    const newStatus = statusUpdates[reportId];
    if (!newStatus) {
      toast.error("Please select a status");
      return;
    }
    dispatch(updateReportStatus(reportId, newStatus));
  };

  // Animation variants for table rows
  const rowVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1 },
    }),
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Reported Jobs</h2>
      {loading ? (
        <p className="text-center">Loading reports...</p>
      ) : reports && reports.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-4 text-left">Job Title</th>
                <th className="py-3 px-4 text-left">Company</th>
                <th className="py-3 px-4 text-left">Reason</th>
                <th className="py-3 px-4 text-left">Reported By</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 text-sm">
              {reports.map((report, index) => (
                <motion.tr
                  key={report._id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={rowVariants}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-4 text-left">{report.jobTitle}</td>
                  <td className="py-3 px-4 text-left">{report.companyName}</td>
                  <td className="py-3 px-4 text-left">{report.reason}</td>
                  <td className="py-3 px-4 text-left">
                    {report.reportedBy ? report.reportedBy.name : "N/A"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <select
                      value={statusUpdates[report._id] || report.status}
                      onChange={(e) =>
                        handleStatusChange(report._id, e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Action Taken">Action Taken</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleUpdateStatus(report._id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                    >
                      Update
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">No reports found.</p>
      )}
    </div>
  );
};

export default AdminReports;
