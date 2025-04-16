import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getAllUsers,
  blockEmployer,
  unblockEmployer,
  clearAdminErrors,
  getBlockedEmployers,
} from "../store/slices/adminSlice";
import { toast } from "react-toastify";

const tableVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300 } },
  exit: { opacity: 0, scale: 0.8 },
};

const AdminUsersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading, error, message, blockedEmployers } = useSelector(
    (state) => state.admin
  );

  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmUnblock, setConfirmUnblock] = useState(null);
  const [duration, setDuration] = useState(7);

  useEffect(() => {
    dispatch(getAllUsers());
    if (error) {
      toast.error(error);
      dispatch(clearAdminErrors());
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, error, message]);

  const handleBlockClick = (user) => {
    setSelectedUser(user);
  };

  const handleBlockConfirm = () => {
    if (!selectedUser || !duration) {
      toast.error("Duration is required");
      return;
    }
    const employerId = selectedUser._id;
    const durationInDays = duration;
    dispatch(blockEmployer(employerId, durationInDays));
    dispatch(getBlockedEmployers());
    setSelectedUser(null);
  };

  const handleUnblock = (userId) => {
    setConfirmUnblock(userId);
  };

  const confirmUnblockAction = () => {
    dispatch(unblockEmployer(confirmUnblock));
    setConfirmUnblock(null);
  };

  const handleViewJobs = (employerId) => {
    navigate(`/employer/${employerId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="p-6 min-h-screen bg-gray-50"
    >
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b-2 border-gray-300 pb-2">
        Manage Users
      </h2>

      {loading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600"
        >
          Loading users...
        </motion.div>
      ) : (
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="bg-white rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden"
        >
          <table className="w-full">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">Name</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">Role</th>
                <th className="py-4 px-6 text-left text-gray-700 font-semibold">Email</th>
                <th className="py-4 px-6 text-center text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {users.map((user) => (
                  <motion.tr
                    key={user._id}
                    variants={rowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="border-b border-gray-100 hover:bg-gray-50"
                    whileHover={{ scale: 1.005 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <td className="py-4 px-6 text-gray-600">{user.name}</td>
                    <td className="py-4 px-6">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{user.email}</td>
                    <td className="py-4 px-6 text-center">
                      {user.role === "Employer" ? (
                        <div className="flex items-center justify-center space-x-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-600 transition-colors border-2 border-blue-600"
                            onClick={() => handleViewJobs(user._id)}
                          >
                            View Jobs
                          </motion.button>
                          {user.isBlocked ? (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-green-600 transition-colors border-2 border-green-600"
                              onClick={() => handleUnblock(user._id)}
                            >
                              Unblock
                            </motion.button>
                          ) : (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-red-600 transition-colors border-2 border-red-600"
                              onClick={() => handleBlockClick(user)}
                            >
                              Block
                            </motion.button>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No actions available</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </motion.div>
      )}

      <AnimatePresence>
        {selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
          >
            <motion.div
              variants={modalVariants}
              className="bg-white rounded-xl p-6 w-full max-w-md border-2 border-gray-300 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Block {selectedUser.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Block Duration
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(parseInt(e.target.value))}
                    className="w-full p-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={7}>7 Days</option>
                    <option value={14}>14 Days</option>
                    <option value={30}>30 Days</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => setSelectedUser(null)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 border-2 border-red-600"
                    onClick={handleBlockConfirm}
                  >
                    Confirm Block
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmUnblock && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center"
          >
            <motion.div
              variants={modalVariants}
              className="bg-white rounded-xl p-6 w-full max-w-md border-2 border-gray-300 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Confirm Unblock
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to unblock this employer?
              </p>
              <div className="flex justify-end space-x-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 text-gray-700 border-2 border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => setConfirmUnblock(null)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 border-2 border-green-600"
                  onClick={confirmUnblockAction}
                >
                  Confirm Unblock
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminUsersList;