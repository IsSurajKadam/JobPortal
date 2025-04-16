import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { clearAllUserErrors, login } from "@/store/slices/userSlice";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { RiLock2Fill } from "react-icons/ri";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const leftSectionVariants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { delay: 0.2, duration: 0.6, ease: "easeOut" },
  },
};

const rightSectionVariants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { delay: 0.4, duration: 0.6, ease: "easeOut" },
  },
};

const Login = () => {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("role", role);
    formData.append("email", email);
    formData.append("password", password);
    dispatch(login(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
      toast.success("User login successfully");
    }
  }, [dispatch, error, loading, isAuthenticated]);

  return (
    <motion.div
      className="flex h-screen items-center justify-center bg-gray-100"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex w-[90%] md:w-[70%] lg:w-[60%] bg-white shadow-lg rounded-xl overflow-hidden">
        {/* Left Section with Motion */}
        <motion.div
          className="w-1/2 hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#1B1D3E] to-[#204674] text-white p-8 relative overflow-hidden"
          variants={leftSectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h2 className="text-3xl font-bold mb-4">Welcome Back!</h2>
          <p className="text-center mb-6 text-sm">
            Don't have an account? Sign up now to explore new opportunities.
          </p>
          <Link
            to="/register"
            className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-orange-100 transition-transform transform hover:scale-105"
          >
            Sign Up
          </Link>
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg
              className="w-full h-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              fill="white"
            >
              <path d="M0,160L48,144C96,128,192,96,288,112C384,128,480,192,576,192C672,192,768,128,864,128C960,128,1056,192,1152,192C1248,192,1344,128,1392,96L1440,64V0H0Z" />
            </svg>
          </div>
        </motion.div>

        {/* Right Section with Motion */}
        <motion.div
          className="w-full md:w-1/2 p-10 flex flex-col justify-center"
          variants={rightSectionVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-3xl font-semibold text-center mb-6">Login</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role Selection */}
            <div>
              <label className="block text-gray-600 font-medium">
                Login As
              </label>
              <div className="flex items-center bg-gray-100 p-2 rounded-lg mt-2">
                <select
                  className="w-full bg-transparent p-2 outline-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Employer">Login as an Employer</option>
                  <option value="Job Seeker">Login as a Job Seeker</option>
                  <option value="Admin">Login as Admin</option>
                </select>
                <FaRegUser className="text-gray-500" />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-gray-600 font-medium">Email</label>
              <div className="flex items-center bg-gray-100 p-2 rounded-lg mt-2">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email"
                  className="bg-transparent w-full outline-none"
                />
                <MdOutlineMailOutline className="text-gray-500" />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-gray-600 font-medium">
                Password
              </label>
              <div className="flex items-center bg-gray-100 p-2 rounded-lg mt-2">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your Password"
                  className="bg-transparent w-full outline-none"
                />
                <RiLock2Fill className="text-gray-500" />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              {loading ? (
                <Button className="w-full bg-gradient-to-br from-[#1B1D3E] to-[#204674] text-white flex justify-center">
                  <Loader2 className="mr-2 h-5 animate-spin" /> Please wait
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full  bg-gradient-to-br from-[#1B1D3E] to-[#204674] text-white hover:bg-[#204674]"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Register Prompt */}
            <p className="text-center mt-4 text-gray-600">
              Create a new account?{" "}
              <Link
                to="/register"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Register
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Login;
