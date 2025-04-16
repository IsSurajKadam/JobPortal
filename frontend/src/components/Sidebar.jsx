import React, { useState } from "react";
import { motion } from "framer-motion";
import {
 
  FaBars,
  FaTimes,
  FaBriefcase,
  FaUser,
  FaCogs,
  FaFileAlt,
  FaClipboardList,
  FaCalendarAlt,
} from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { useSelector } from "react-redux";
import { FaRightFromBracket } from "react-icons/fa6";

const Sidebar = ({ setComponentName }) => {
  const { user } = useSelector((state) => state.user);
  const role = user?.role;
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  return (
    <>
      {/* Overlay with animation */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        ></motion.div>
      )}

      {/* Hamburger Button */}
      <motion.button
        className="md:hidden fixed top-[60px] left-0 z-50 p-3 bg-indigo-600 text-white rounded-r-lg shadow-lg"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
      >
        <FaRightFromBracket className="text-xl" />
      </motion.button>

      {/* Sidebar Container */}
      <motion.div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-blue-50 to-indigo-50 p-5 shadow-xl z-50`}
        initial="closed"
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {/* Close Button */}
        <motion.button
          className="md:hidden absolute top-4 right-4 p-2 bg-indigo-600 text-white rounded-lg"
          onClick={() => setIsOpen(false)}
          whileHover={{ rotate: 90 }}
        >
          <FaTimes className="text-xl" />
        </motion.button>

        <h2 className="text-2xl font-bold mb-8 text-indigo-600">Dashboard</h2>
        
        <nav className="space-y-4">
          {/* Common Items */}
          <motion.div variants={itemVariants}>
            <button
              onClick={() => setComponentName("My Profile")}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-all"
            >
              <FaUser className="text-xl text-indigo-500" />
              <span>My Profile</span>
              <FiChevronRight className="ml-auto" />
            </button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              onClick={() => setComponentName("Update Profile")}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-all"
            >
              <FaCogs className="text-xl text-indigo-500" />
              <span>Update Profile</span>
              <FiChevronRight className="ml-auto" />
            </button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <button
              onClick={() => setComponentName("Update Password")}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-all"
            >
              <FaCogs className="text-xl text-indigo-500" />
              <span>Update Password</span>
              <FiChevronRight className="ml-auto" />
            </button>
          </motion.div>

          {/* Job Seeker Items */}
          {role === "Job Seeker" && (
            <>
              <motion.div variants={itemVariants}>
                <button
                  onClick={() => setComponentName("My Applications")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-all"
                >
                  <FaClipboardList className="text-xl text-indigo-500" />
                  <span>My Applications</span>
                  <FiChevronRight className="ml-auto" />
                </button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  onClick={() => setComponentName("myInterviews")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-all"
                >
                  <FaCalendarAlt className="text-xl text-indigo-500" />
                  <span>My Interviews</span>
                  <FiChevronRight className="ml-auto" />
                </button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  onClick={() => setComponentName("savedJobs")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-all"
                >
                  <FaCalendarAlt className="text-xl text-indigo-500" />
                  <span>Saved Jobs</span>
                  <FiChevronRight className="ml-auto" />
                </button>
              </motion.div>
            </>
          )}

          {/* Employer Items */}
          {role === "Employer" && (
            <>
              <motion.div variants={itemVariants}>
                <button
                  onClick={() => setComponentName("My Jobs")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-all"
                >
                  <FaBriefcase className="text-xl text-indigo-500" />
                  <span>My Jobs</span>
                  <FiChevronRight className="ml-auto" />
                </button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  onClick={() => setComponentName("savedJobs")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-all"
                >
                  <FaCalendarAlt className="text-xl text-indigo-500" />
                  <span>Saved Jobs</span>
                  <FiChevronRight className="ml-auto" />
                </button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  onClick={() => setComponentName("Job Post")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-all"
                >
                  <FaFileAlt className="text-xl text-indigo-500" />
                  <span>Job Post</span>
                  <FiChevronRight className="ml-auto" />
                </button>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  onClick={() => setComponentName("Applications")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-indigo-100 hover:text-indigo-600 transition-all"
                >
                  <FaClipboardList className="text-xl text-indigo-500" />
                  <span>Applications</span>
                  <FiChevronRight className="ml-auto" />
                </button>
              </motion.div>
            </>
          )}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
