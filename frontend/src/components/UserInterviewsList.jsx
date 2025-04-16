import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchUserInterviews,
  updateInterviewStatus,
  deleteInterview,
} from "../store/slices/interviewSlice";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { FiEdit, FiTrash2, FiMessageSquare, FiLink, FiClock, FiCalendar } from "react-icons/fi";
import Spinner from "@/components/Spinner";

const UserInterviewsList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { interviews, loading, error } = useSelector((state) => state.interviews);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserInterviews(user._id));
  }, [dispatch, user._id]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateInterviewStatus(id, newStatus))
      .unwrap()
      .then(() => toast.success("Status updated successfully"))
      .catch(() => toast.error("Update failed"));
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this interview?")) {
      dispatch(deleteInterview(id))
        .unwrap()
        .then(() => toast.success("Interview deleted"))
        .catch((err) => toast.error(err || "Deletion failed"));
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (error) return (
    <motion.p 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-red-500 text-center p-4 bg-red-50 rounded-lg mx-4"
    >
      {error}
    </motion.p>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <motion.h1
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
      >
        My Interviews
      </motion.h1>

      {loading ? (
        <div className="flex justify-center p-8">
          <Spinner size="lg" />
        </div>
      ) : interviews.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center p-8 bg-white rounded-2xl border-2 border-dashed border-gray-200"
        >
          <FiCalendar className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
          <p className="text-xl font-semibold text-gray-600">No interviews scheduled</p>
          <p className="text-gray-500 mt-2">Your upcoming interviews will appear here</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Company</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Position</th>
                  <th className="p-4 text-left text-sm font-semibold text-gray-700">Candidate</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Meeting</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Date & Time</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Status</th>
                  <th className="p-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {interviews.map((interview) => (
                    <motion.tr
                      key={interview._id}
                      variants={itemVariants}
                      className="border-t border-gray-100 hover:bg-gray-50"
                      whileHover={{ scale: 1.005 }}
                    >
                      <td className="p-4 font-medium text-gray-900">{interview.jobId.companyName}</td>
                      <td className="p-4 text-gray-600">{interview.jobId.title}</td>
                      <td className="p-4 text-gray-600">{interview.candidateId.name}</td>
                      <td className="p-4 text-center">
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800"
                        >
                          <FiLink className="mr-2" /> Join
                        </a>
                      </td>
                      <td className="p-4 text-center text-gray-600">
                        <div className="flex flex-col items-center">
                          <span className="flex items-center">
                            <FiCalendar className="mr-2" />
                            {new Date(interview.dateTime).toLocaleDateString("en-GB")}
                          </span>
                          <span className="flex items-center mt-1">
                            <FiClock className="mr-2" />
                            {new Date(interview.dateTime).toLocaleTimeString("en-US", {
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        {user.role === "Employer" ? (
                          <select
                            value={interview.status}
                            onChange={(e) => handleStatusChange(interview._id, e.target.value)}
                            className="px-3 py-1 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-colors"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Scheduled">Scheduled</option>
                            <option value="Accepted">Hired</option>
                            <option value="Rejected">Rejected</option>
                          </select>
                        ) : (
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            interview.status === "Pending" ? "bg-amber-100 text-amber-800" :
                            interview.status === "Scheduled" ? "bg-blue-100 text-blue-800" :
                            interview.status === "Accepted" ? "bg-green-100 text-green-800" :
                            "bg-red-100 text-red-800"
                          }`}>
                            {interview.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center space-y-2">
                        <div className="flex flex-col gap-2 items-center">
                          {user.role === "Employer" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="w-full max-w-[120px] flex items-center"
                                onClick={() => navigate(`/interview/edit/${interview._id}`)}
                              >
                                <FiEdit className="mr-2" /> Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="w-full max-w-[120px] flex items-center"
                                onClick={() => handleDelete(interview._id)}
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </Button>
                            </>
                          )}
                          {user.role === "Job Seeker" && (
                            <Button
                              variant="default"
                              size="sm"
                              className="w-full max-w-[160px] flex items-center"
                              onClick={() => navigate(`/interview/feedback/${interview._id}`)}
                            >
                              <FiMessageSquare className="mr-2" /> Feedback
                            </Button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UserInterviewsList;