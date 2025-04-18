import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaBuilding } from "react-icons/fa";
import { 
  FiBriefcase, 
  FiCalendar, 
  FiEye, 
  FiInfo,
  FiAlertCircle
} from "react-icons/fi";
import { getEmployerJobs, clearAdminErrors } from "@/store/slices/adminSlice";

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const rowVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const AdminEmployerJobs = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { employerId } = useParams();
  const { employerJobs, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    if (employerId) {
      dispatch(getEmployerJobs(employerId));
    }
  }, [dispatch, employerId]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 flex items-center">
        <FiBriefcase className="mr-3 text-blue-600" />
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Employer Job Listings
        </span>
      </h2>

      <AnimatePresence>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          </motion.div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-red-50 border-2 border-red-200 rounded-2xl flex items-center"
          >
            <FiAlertCircle className="text-red-500 mr-3 text-xl" />
            <p className="text-red-600">{error}</p>
          </motion.div>
        ) : employerJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-white border-2 border-gray-200 rounded-2xl flex items-center"
          >
            <FiInfo className="text-gray-500 mr-3 text-xl" />
            <p className="text-gray-600">No jobs found for this employer</p>
          </motion.div>
        ) : (
          <>
            {/* Desktop/Tablet Table */}
            <div className="hidden md:block">
              <motion.div
                variants={tableVariants}
                initial="hidden"
                animate="visible"
                className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden"
              >
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <tr>
                      <th className="py-5 px-6 text-left font-semibold">Job Title</th>
                      <th className="py-5 px-6 text-left font-semibold">Company</th>
                      <th className="py-5 px-6 text-left font-semibold">Posted On</th>
                      <th className="py-5 px-6 text-center font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {employerJobs.map((job) => (
                        <motion.tr
                          key={job._id}
                          variants={rowVariants}
                          className="border-b border-gray-100 hover:bg-blue-50 group"
                          whileHover={{ scale: 1.005 }}
                        >
                          <td className="py-4 px-6 text-gray-800 font-medium">
                            <div className="flex items-center">
                              <FiBriefcase className="h-5 w-5 mr-3 text-blue-500" />
                              {job.title}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            <div className="flex items-center">
                              <FaBuilding className="h-5 w-5 mr-3 text-emerald-500" />
                              {job.companyName}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-600">
                            <div className="flex items-center">
                              <FiCalendar className="h-5 w-5 mr-3 text-amber-500" />
                              {new Date(job.jobPostedOn).toDateString()}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-center">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-600"
                              onClick={() => navigate(`/job/${job._id}`)}
                            >
                              <FiEye className="mr-2" />
                              View Details
                            </motion.button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </motion.div>
            </div>

            {/* Mobile Card Layout */}
            <div className="md:hidden grid gap-4">
              <AnimatePresence>
                {employerJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    variants={cardVariants}
                    className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
                    whileHover={{ y: -3 }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <FiBriefcase className="h-6 w-6 mr-3 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-800">{job.title}</h3>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <FaBuilding className="h-5 w-5 mr-3 text-emerald-500" />
                        <span>{job.companyName}</span>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <FiCalendar className="h-5 w-5 mr-3 text-amber-500" />
                        <span>{new Date(job.jobPostedOn).toDateString()}</span>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center justify-center"
                        onClick={() => navigate(`/job/${job._id}`)}
                      >
                        <FiEye className="mr-2" />
                        View Details
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminEmployerJobs;