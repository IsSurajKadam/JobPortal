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
import { FaBuilding } from "react-icons/fa";
import { 
  FiEdit, 
  FiTrash2, 
  FiMessageSquare, 
  FiLink, 
  FiClock, 
  FiCalendar,
  FiBriefcase,
  FiUser,
  
} from "react-icons/fi";
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
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 120 }
    }
  };

  const statusColors = {
    Pending: "bg-amber-100 text-amber-800",
    Scheduled: "bg-blue-100 text-blue-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800"
  };

  if (error) return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-center mx-4"
    >
      {error}
    </motion.div>
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 md:p-6"
    >
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-3xl font-bold text-center py-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
        >
          My Interviews
        </motion.h1>
        
        <div className="overflow-x-auto">
          {loading ? (
            <div className="min-h-[200px] flex items-center justify-center">
              <Spinner className="text-blue-600 h-12 w-12" />
            </div>
          ) : interviews.length > 0 ? (
            <motion.table 
              className="w-full"
              variants={containerVariants}
            >
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {["Company", "Job Title", "Candidate", "Meeting", "Date", "Time", "Status", "Actions"].map((header, idx) => (
                    <th 
                      key={idx}
                      className="p-4 text-left text-gray-700 font-semibold"
                    >
                      <div className="flex items-center">
                        {header === "Company" && <FaBuilding className="mr-2 text-blue-500" />}
                        {header === "Job Title" && <FiBriefcase className="mr-2 text-emerald-500" />}
                        {header === "Candidate" && <FiUser className="mr-2 text-purple-500" />}
                        {header === "Meeting" && <FiLink className="mr-2 text-amber-500" />}
                        {header === "Date" && <FiCalendar className="mr-2 text-rose-500" />}
                        {header === "Time" && <FiClock className="mr-2 text-indigo-500" />}
                        {header}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {interviews.map((interview) => (
                    <motion.tr
                      key={interview._id}
                      variants={itemVariants}
                      className="border-b border-gray-100 hover:bg-blue-50"
                      whileHover={{ scale: 1.005 }}
                    >
                      <td className="p-4">{interview.jobId.companyName}</td>
                      <td className="p-4 font-medium text-gray-800">{interview.jobId.title}</td>
                      <td className="p-4">{interview.candidateId.name}</td>
                      <td className="p-4">
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <FiLink className="mr-2" />
                          Join Meeting
                        </a>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <FiCalendar className="mr-2 text-gray-500" />
                          {new Date(interview.dateTime).toLocaleDateString("en-GB")}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <FiClock className="mr-2 text-gray-500" />
                          {new Date(interview.dateTime).toLocaleTimeString("en-US", {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                          })}
                        </div>
                      </td>
                      <td className="p-4">
                        {user.role === "Employer" ? (
                          <select
                            value={interview.status}
                            onChange={(e) => handleStatusChange(interview._id, e.target.value)}
                            className={`${statusColors[interview.status]} px-3 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 transition-all`}
                          >
                            {Object.keys(statusColors).map((status) => (
                              <option key={status} value={status}>{status}</option>
                            ))}
                          </select>
                        ) : (
                          <span className={`${statusColors[interview.status]} px-3 py-1 rounded-full`}>
                            {interview.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 space-y-2">
                        {user.role === "Employer" ? (
                          <>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Button
                                variant="outline"
                                onClick={() => navigate(`/interview/edit/${interview._id}`)}
                                className="w-full flex items-center"
                              >
                                <FiEdit className="mr-2" /> Edit
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <Button
                                variant="destructive"
                                onClick={() => handleDelete(interview._id)}
                                className="w-full flex items-center"
                              >
                                <FiTrash2 className="mr-2" /> Delete
                              </Button>
                            </motion.div>
                          </>
                        ) : (
                          <motion.div whileHover={{ scale: 1.05 }}>
                            <Button
                              variant="default"
                              onClick={() => navigate(`/interview/feedback/${interview._id}`)}
                              className="flex items-center"
                            >
                              <FiMessageSquare className="mr-2" /> Feedback
                            </Button>
                          </motion.div>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </motion.table>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 text-center text-gray-500"
            >
              No interviews scheduled yet
            </motion.div>
          )}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="block md:hidden space-y-4">
        {loading ? (
          <div className="min-h-[200px] flex items-center justify-center">
            <Spinner className="text-blue-600 h-12 w-12" />
          </div>
        ) : interviews.length > 0 ? (
          <AnimatePresence>
            {interviews.map((interview) => (
              <motion.div
                key={interview._id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="bg-white border border-gray-200 rounded-2xl p-4 shadow-lg"
                whileHover={{ y: -2 }}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-blue-600">
                      <FiBriefcase className="inline mr-2" />
                      {interview.jobId.title}
                    </h2>
                    <span className={`${statusColors[interview.status]} px-2.5 py-1 rounded-full text-sm`}>
                      {interview.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-gray-600">
                    <FaBuilding className="mr-2 text-emerald-500" />
                    {interview.jobId.companyName}
                  </div>

                  <div className="flex items-center text-gray-600">
                    <FiUser className="mr-2 text-purple-500" />
                    {interview.candidateId.name}
                  </div>

                  <div className="flex items-center text-blue-600">
                    <FiLink className="mr-2 text-amber-500" />
                    <a 
                      href={interview.meetingLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Join Meeting
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center text-gray-600">
                      <FiCalendar className="mr-2 text-rose-500" />
                      {new Date(interview.dateTime).toLocaleDateString("en-GB")}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <FiClock className="mr-2 text-indigo-500" />
                      {new Date(interview.dateTime).toLocaleTimeString("en-US", {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true
                      })}
                    </div>
                  </div>

                  <div className="pt-2">
                    {user.role === "Employer" ? (
                      <div className="flex gap-2">
                        <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/interview/edit/${interview._id}`)}
                            className="w-full flex items-center"
                          >
                            <FiEdit className="mr-2" /> Edit
                          </Button>
                        </motion.div>
                        <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(interview._id)}
                            className="w-full flex items-center"
                          >
                            <FiTrash2 className="mr-2" /> Delete
                          </Button>
                        </motion.div>
                      </div>
                    ) : (
                      <motion.div whileTap={{ scale: 0.95 }}>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => navigate(`/interview/feedback/${interview._id}`)}
                          className="w-full flex items-center"
                        >
                          <FiMessageSquare className="mr-2" /> Feedback
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 text-center text-gray-500 bg-gray-50 rounded-xl"
          >
            No interviews scheduled yet
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UserInterviewsList;