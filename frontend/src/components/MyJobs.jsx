import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  clearAllJobErrors,
  deleteJob,
  getMyJobs,
  resetJobSlice,
} from "../store/slices/jobSlice";
import Spinner from "../components/Spinner";
import {
  FiTrash2,
  FiBriefcase,
  FiPackage,
  FiDollarSign,
  FiMapPin,
} from "react-icons/fi";

const MyJobs = () => {
  const { loading, error, myJobs, message } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetJobSlice());
    }
    dispatch(getMyJobs());
  }, [dispatch, error, message]);

  const handleDeleteJob = (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this job?");
    if (confirmDelete) {
      dispatch(deleteJob(id));
    }
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
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 50 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-white rounded-2xl shadow-lg border border-gray-100"
    >
      <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        My Job Postings
      </h3>

      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      ) : myJobs.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200"
        >
          <FiBriefcase className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-xl font-semibold text-gray-600">No Jobs Posted Yet</p>
          <p className="text-gray-500 mt-2">Start by creating your first job posting</p>
        </motion.div>
      ) : (
        <>
          {/* Table Layout - Medium and Up */}
          <motion.div
            variants={tableVariants}
            initial="hidden"
            animate="visible"
            className="hidden md:block overflow-x-auto rounded-xl border border-gray-200"
          >
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr className="text-left text-gray-700">
                  <th className="p-4 font-semibold border-b border-gray-200 min-w-[200px]">Job Title</th>
                  <th className="p-4 font-semibold border-b border-gray-200 min-w-[180px]">Company</th>
                  <th className="p-4 font-semibold border-b border-gray-200 min-w-[180px]">Location</th>
                  <th className="p-4 font-semibold border-b border-gray-200 min-w-[120px]">Salary</th>
                  <th className="p-4 font-semibold border-b border-gray-200 min-w-[150px]">Type</th>
                  <th className="p-4 font-semibold border-b border-gray-200 text-center min-w-[150px]">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {myJobs.map((job) => (
                    <motion.tr
                      key={job._id}
                      variants={rowVariants}
                      className="border-b border-gray-100 hover:bg-gray-50"
                      whileHover={{ scale: 1.005 }}
                    >
                      <td className="p-4 font-medium text-gray-900 align-middle">{job.title}</td>
                      <td className="p-4 text-gray-600 align-middle">
                        <div className="flex items-center">
                          <FiPackage className="w-5 h-5 text-gray-600 mr-2" />
                          {job.companyName}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 align-middle">
                        <div className="flex items-center">
                          <FiMapPin className="w-5 h-5 text-gray-600 mr-2" />
                          {job.location}
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 align-middle">
                        <div className="flex items-center">
                          <FiDollarSign className="w-5 h-5 text-gray-600 mr-2" />
                          ${job.salary}
                        </div>
                      </td>
                      <td className="p-4 align-middle">
                        <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm inline-block">
                          {job.jobType}
                        </span>
                      </td>
                      <td className="p-4 text-center align-middle">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="inline-flex items-center justify-center px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                          onClick={() => handleDeleteJob(job._id)}
                        >
                          <FiTrash2 className="mr-2" />
                          Delete
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>

          {/* Card Layout - Small Screens */}
          <div className="block md:hidden space-y-4">
            <AnimatePresence>
              {myJobs.map((job) => (
                <motion.div
                  key={job._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm"
                >
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">{job.title}</h4>
                  <div className="text-sm text-gray-600 mb-1 flex items-center">
                    <FiPackage className="mr-2" /> {job.companyName}
                  </div>
                  <div className="text-sm text-gray-600 mb-1 flex items-center">
                    <FiMapPin className="mr-2" /> {job.location}
                  </div>
                  <div className="text-sm text-gray-600 mb-1 flex items-center">
                    <FiDollarSign className="mr-2" /> ${job.salary}
                  </div>
                  <div className="text-sm text-blue-800 py-2 inline-block bg-blue-100 px-2 my-2 rounded-full">
                    {job.jobType}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center px-3 float-right py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    onClick={() => handleDeleteJob(job._id)}
                  >
                    <FiTrash2 className="mr-2" />
                    Delete
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default MyJobs;
