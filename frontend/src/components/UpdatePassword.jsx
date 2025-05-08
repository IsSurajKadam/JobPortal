import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaRegEyeSlash, FaEye } from "react-icons/fa";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  clearAllUpdateProfileErrors,
  updatePassword,
} from "../store/slices/updateProfileSlice";
import { getUser } from "../store/slices/userSlice";
import { FiLock } from "react-icons/fi";

const UpdatePassword = () => {
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });
  const [errors, setErrors] = useState({});

  const { loading, error, isUpdated } = useSelector(
    (state) => state.updateProfile
  );
  const dispatch = useDispatch();

  const validateForm = () => {
    const newErrors = {};
    if (!passwords.oldPassword) newErrors.oldPassword = "Current password required";
    if (passwords.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
    if (passwords.newPassword !== passwords.confirmPassword) newErrors.confirmPassword = "Passwords don't match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("oldPassword", passwords.oldPassword);
    formData.append("newPassword", passwords.newPassword);
    formData.append("confirmPassword", passwords.confirmPassword);
    dispatch(updatePassword(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUpdateProfileErrors());
    }
    if (isUpdated) {
      toast.success("Password Updated Successfully");
      dispatch(getUser());
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    }
  }, [dispatch, error, isUpdated]);

  const inputFields = [
    {
      label: "Current Password",
      name: "oldPassword",
      type: showPassword.old ? "text" : "password",
      toggle: "old"
    },
    {
      label: "New Password",
      name: "newPassword",
      type: showPassword.new ? "text" : "password",
      toggle: "new"
    },
    {
      label: "Confirm Password",
      name: "confirmPassword",
      type: showPassword.confirm ? "text" : "password",
      toggle: "confirm"
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-6"
    >
      <motion.form
        onSubmit={handleUpdatePassword}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <div className="flex flex-col items-center mb-8">
          <FiLock className="w-12 h-12 text-blue-600 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">Update Password</h2>
        </div>

        <div className="space-y-6">
          {inputFields.map((field, index) => (
            <motion.div
              key={field.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative">
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {field.label}
                </label>
                <div className="relative">
                  <input
                    type={field.type}
                    value={passwords[field.name]}
                    onChange={(e) => setPasswords({
                      ...passwords,
                      [field.name]: e.target.value
                    })}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors[field.name] ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword({
                      ...showPassword,
                      [field.toggle]: !showPassword[field.toggle]
                    })}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
                  >
                    {showPassword[field.toggle] ? (
                      <FaRegEyeSlash className="w-5 h-5" />
                    ) : (
                      <FaEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors[field.name] && (
                  <p className="text-red-500 text-sm mt-1">{errors[field.name]}</p>
                )}
              </div>
            </motion.div>
          ))}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-lg font-semibold shadow-lg transition-all relative"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Updating...
              </div>
            ) : (
              "Update Password"
            )}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default UpdatePassword;