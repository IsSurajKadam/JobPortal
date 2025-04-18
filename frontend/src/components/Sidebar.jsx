import React from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  FaBriefcase,
  FaUser,
  FaCogs,
  FaFileAlt,
  FaClipboardList,
  FaCalendarAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { GoReport } from "react-icons/go";

const Sidebar = ({
  setComponentName,
  activeComponent,
  isMobile,
  isSidebarOpen,
  setIsSidebarOpen,
}) => {
  const { user } = useSelector((state) => state.user);
  const role = user?.role;

  const sidebarVariants = {
    mobile: {
      open: { x: 0 },
      closed: { x: "-100%" },
    },
    desktop: {
      open: { width: "280px" },
      closed: { width: "280px" }, // Sidebar always visible on desktop
    },
  };

  const itemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -20 },
  };

  const menuItems = {
    common: [
      { name: "My Profile", icon: <FaUser />, component: "My Profile" },
      { name: "Update Profile", icon: <FaCogs />, component: "Update Profile" },
      {
        name: "Update Password",
        icon: <FaCogs />,
        component: "Update Password",
      },
    ],
    jobSeeker: [
      {
        name: "My Applications",
        icon: <FaClipboardList />,
        component: "My Applications",
      },
      {
        name: "My Interviews",
        icon: <FaCalendarAlt />,
        component: "myInterviews",
      },
      { name: "Saved Jobs", icon: <FaCalendarAlt />, component: "savedJobs" },
      {
        name:"Reports",icon:<GoReport/>,component:"myReports"
      }
    ],
    employer: [
      { name: "My Jobs", icon: <FaBriefcase />, component: "My Jobs" },
      { name: "Saved Jobs", icon: <FaCalendarAlt />, component: "savedJobs" },
      { name: "Job Post", icon: <FaFileAlt />, component: "Job Post" },
      {
        name: "Applications",
        icon: <FaClipboardList />,
        component: "Applications",
      },
      {
        name: "Interviews",
        icon: <FaClipboardList />,
        component: "myInterviews",
      },
    ],
    admin: [
      { name: "All Users", icon: <FaBriefcase />, component: "Users" },
      { name: "All Reports", icon: <FaBriefcase />, component: "Reports" },
    ],
  };

  const handleItemClick = (component) => {
    setComponentName(component);
    if (isMobile) setIsSidebarOpen(false);
  };

  const renderMenuItems = (items) =>
    items.map((item) => (
      <motion.button
        key={item.component}
        onClick={() => handleItemClick(item.component)}
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
    ));

  return (
    <>
{isMobile && (
  <motion.button
    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
    className="fixed  z-50 p-2 bg-indigo-600 text-white rounded-lg shadow-lg transition-all duration-300"
    style={{
   
      left: isSidebarOpen ? "240px" : "0.5rem",
      top:isSidebarOpen ? "0.1rem":"65px"
      
    }}
    animate={isSidebarOpen ? { rotate: 90 } : { rotate: 0 }}
    whileHover={{ scale: 1.1 }}
  >
    {isSidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
  </motion.button>
)}


      {/* Sidebar Container */}
      <motion.div
        className="sidebar min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-5 shadow-xl"
        initial={false}
        animate={isSidebarOpen ? "open" : "closed"}
        variants={isMobile ? sidebarVariants.mobile : sidebarVariants.desktop}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{
          position: isMobile ? "fixed" : "relative",
          top: 0,
          left: 0,
          width: "280px",
          zIndex: 40,
          height: "100vh",
        }}
      >
        <h2 className="text-2xl font-bold mb-8 text-indigo-600">Dashboard</h2>

        <nav className="space-y-4">
          {renderMenuItems(menuItems.common)}
          {role === "Job Seeker" && renderMenuItems(menuItems.jobSeeker)}
          {role === "Employer" && renderMenuItems(menuItems.employer)}
          {role === "Admin" && renderMenuItems(menuItems.admin)}
        </nav>
      </motion.div>
    </>
  );
};

export default Sidebar;
