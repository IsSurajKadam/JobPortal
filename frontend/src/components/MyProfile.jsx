import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaBriefcase,
  FaCalendarAlt,
} from "react-icons/fa";
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiCalendar } from "react-icons/fi";

const MyProfile = () => {
  const { user } = useSelector((state) => state.user);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
    >
      <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        My Profile
      </h3>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <ProfileField 
          icon={<FiUser className="w-5 h-5" />}
          label="Name" 
          value={user?.name}
          variants={itemVariants}
        />
        <ProfileField
          icon={<FiMail className="w-5 h-5" />}
          label="Email Address"
          value={user?.email}
          variants={itemVariants}
        />
        
        {user?.role === "Job Seeker" && (
          <ProfileField
            icon={<FiBriefcase className="w-5 h-5" />}
            label="Preferred Niches"
            value={[
              user?.niches?.firstNiche,
              user?.niches?.secondNiche,
              user?.niches?.thirdNiche,
            ]
              .filter(Boolean)
              .join(", ") || "Not specified"}
            variants={itemVariants}
          />
        )}

        <ProfileField
          icon={<FiPhone className="w-5 h-5" />}
          label="Phone Number"
          value={user?.phone}
          variants={itemVariants}
        />
        <ProfileField
          icon={<FiMapPin className="w-5 h-5" />}
          label="Address"
          value={user?.address}
          variants={itemVariants}
        />
        <ProfileField
          icon={<FiBriefcase className="w-5 h-5" />}
          label="Role"
          value={user?.role}
          variants={itemVariants}
        />
        <ProfileField
          icon={<FiCalendar className="w-5 h-5" />}
          label="Member Since"
          value={new Date(user?.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
          variants={itemVariants}
        />
      </motion.div>
    </motion.div>
  );
};

const ProfileField = ({ icon, label, value, variants }) => (
  <motion.div
    variants={variants}
    className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-colors"
    whileHover={{ scale: 1.02 }}
  >
    <span className="text-blue-600 bg-blue-50 p-2 rounded-lg">{icon}</span>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-500 mb-1">{label}</p>
      <p className={`text-lg font-semibold ${value ? "text-gray-800" : "text-gray-400 italic"}`}>
        {value || "Not provided"}
      </p>
    </div>
  </motion.div>
);

export default MyProfile;