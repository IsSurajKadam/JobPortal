import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
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
      className="p-6 min-h-screen bg-gray-50"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-gray-300 pb-2">
        Employer Job Listings
      </h2>

      <AnimatePresence>
        {loading ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-lg text-gray-600"
          >
            Loading jobs...
          </motion.p>
        ) : error ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-center p-4 border-2 border-red-200 bg-red-50 rounded-lg"
          >
            {error}
          </motion.p>
        ) : employerJobs.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-600 text-center p-4 border-2 border-gray-200 bg-white rounded-lg"
          >
            No jobs found for this employer.
          </motion.p>
        ) : (
          <motion.div
            variants={tableVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden"
          >
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">Job Title</th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">Company</th>
                  <th className="py-4 px-6 text-left text-gray-700 font-semibold">Posted On</th>
                  <th className="py-4 px-6 text-center text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {employerJobs.map((job) => (
                    <motion.tr
                      key={job._id}
                      variants={rowVariants}
                      className="border-b border-gray-100 hover:bg-gray-50"
                      whileHover={{ scale: 1.005 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <td className="py-4 px-6 text-gray-600">{job.title}</td>
                      <td className="py-4 px-6 text-gray-600">{job.companyName}</td>
                      <td className="py-4 px-6 text-gray-600">
                        {new Date(job.jobPostedOn).toDateString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition-colors border-2 border-blue-600"
                          onClick={() => navigate(`/job/${job._id}`)}
                        >
                          View Details
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminEmployerJobs;