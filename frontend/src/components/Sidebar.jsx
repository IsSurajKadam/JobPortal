import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaHome,
  FaBriefcase,
  FaUser,
  FaCogs,
  FaFileAlt,
  FaClipboardList,
  FaCalendarAlt,
  FaCalendarPlus,
} from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";

const Sidebar = ({ setComponentName, activeComponent }) => {
  const { user } = useSelector((state) => state.user);
  const role = user?.role;

  const sidebarVariants = {
    open: { width: "280px", transition: { type: "spring", stiffness: 300 } },
    closed: { width: "80px" }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 }
  };

  const menuItems = {
    common: [
      { name: "My Profile", icon: <FaUser />, component: "My Profile" },
      { name: "Update Profile", icon: <FaCogs />, component: "Update Profile" },
      { name: "Update Password", icon: <FaCogs />, component: "Update Password" }
    ],
    jobSeeker: [
      { name: "My Applications", icon: <FaClipboardList />, component: "My Applications" },
      { name: "My Interviews", icon: <FaCalendarAlt />, component: "myInterviews" },
      { name: "Saved Jobs", icon: <FaCalendarAlt />, component: "savedJobs" }
    ],
    employer: [
      { name: "My Jobs", icon: <FaBriefcase />, component: "My Jobs" },
      { name: "Saved Jobs", icon: <FaCalendarAlt />, component: "savedJobs" },
      { name: "Job Post", icon: <FaFileAlt />, component: "Job Post" },
      { name: "Applications", icon: <FaClipboardList />, component: "Applications" },
      { name: "Interviews", icon: <FaClipboardList />, component: "myInterviews" }
    ],
    admin: [
      { name: "All Users", icon: <FaBriefcase />, component: "Users" },
      { name: "All Reports", icon: <FaBriefcase />, component: "Reports" }
    ]
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-5 shadow-xl relative"
      initial={{ width: 280 }}
      variants={sidebarVariants}
    >
      <h2 className="text-2xl font-bold mb-8 text-indigo-600">Dashboard</h2>
      
      <nav className="space-y-4">
        {/* Common Items */}
        {menuItems.common.map((item) => (
          <motion.button
            key={item.component}
            onClick={() => setComponentName(item.component)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeComponent === item.component 
                ? "bg-indigo-600 text-white shadow-md"
                : "hover:bg-indigo-100 hover:text-indigo-600"
            }`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
            <FiChevronRight className="ml-auto" />
          </motion.button>
        ))}

        {/* Role-specific Items */}
        {role === "Job Seeker" && menuItems.jobSeeker.map((item) => (
          <motion.button
            key={item.component}
            onClick={() => setComponentName(item.component)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeComponent === item.component 
                ? "bg-indigo-600 text-white shadow-md"
                : "hover:bg-indigo-100 hover:text-indigo-600"
            }`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
            <FiChevronRight className="ml-auto" />
          </motion.button>
        ))}

        {role === "Employer" && menuItems.employer.map((item) => (
          <motion.button
            key={item.component}
            onClick={() => setComponentName(item.component)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeComponent === item.component 
                ? "bg-indigo-600 text-white shadow-md"
                : "hover:bg-indigo-100 hover:text-indigo-600"
            }`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
            <FiChevronRight className="ml-auto" />
          </motion.button>
        ))}

        {role === "Admin" && menuItems.admin.map((item) => (
          <motion.button
            key={item.component}
            onClick={() => setComponentName(item.component)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${
              activeComponent === item.component 
                ? "bg-indigo-600 text-white shadow-md"
                : "hover:bg-indigo-100 hover:text-indigo-600"
            }`}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
            <FiChevronRight className="ml-auto" />
          </motion.button>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;