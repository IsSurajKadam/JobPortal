import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { clearAllUserErrors, register } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const Register = () => {
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [firstNiche, setFirstNiche] = useState("");
  const [secondNiche, setSecondNiche] = useState("");
  const [thirdNiche, setThirdNiche] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");
  const [secretKey, setSecretKey] = useState("");

  const nichesArray = [
    "Software Development",
    "Web Development",
    "Cybersecurity",
    "Data Science",
    "Artificial Intelligence",
    "Cloud Computing",
    "DevOps",
    "Mobile App Development",
    "Blockchain",
    "Database Administration",
    "Network Administration",
    "UI/UX Design",
    "Game Development",
    "IoT (Internet of Things)",
    "Big Data",
    "Machine Learning",
    "IT Project Management",
    "IT Support and Helpdesk",
    "Systems Administration",
    "IT Consulting",
  ];

  const resumeHandler = (e) => setResume(e.target.files[0]);

  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // 1) basic format check
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    const formData = new FormData();
    formData.append("role", role);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("password", password);

    if (role === "Job Seeker") {
      formData.append("firstNiche", firstNiche);
      formData.append("secondNiche", secondNiche);
      formData.append("thirdNiche", thirdNiche);
      formData.append("coverLetter", coverLetter);
      formData.append("resume", resume);
    }

    if (role === "Admin") {
      formData.append("secretKey", secretKey);
    }
    console.log("formdata", formData);
    dispatch(register(formData));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUserErrors());
    }
    if (isAuthenticated) {
      navigateTo("/");
      toast.success("User registered successfully");
    }
  }, [dispatch, error, isAuthenticated, navigateTo]);

  return (
    <div className="max-w-7xl mx-auto my-10 flex items-center justify-center">
      <div className="flex w-full border border-gray-200 shadow-md">
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-1/3 hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-[#1B1D3E] to-[#204674] text-white rounded-l-lg p-6"
        >
          <h2 className="text-3xl font-semibold mb-4">Welcome Back!</h2>
          <p className="mb-6 text-center">
            Already have an account? Click below to sign in and explore new
            opportunities.
          </p>
          <Link
            to="/login"
            className="bg-white text-orange-600 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition duration-300"
          >
            Sign In
          </Link>
        </motion.div>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full md:w-2/3 p-5"
        >
          <h1 className="text-center font-medium text-3xl pb-5">
            Create a new account
          </h1>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Label>Register As</Label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border p-2 bg-gray-100 rounded-lg"
              >
                <option value="">Select Role</option>
                <option value="Employer">Register as an Employer</option>
                <option value="Job Seeker">Register as a Job Seeker</option>
                <option value="Admin">Register as a Admin</option>
              </select>
            </div>

            <Input
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              type="text"
              placeholder="Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {role === "Admin" && (
              <>
                <Label>Your secretKey</Label>
                <Input
                  placeholder="key"
                  type="password"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                />
              </>
            )}

            {role === "Job Seeker" && (
              <>
                {[firstNiche, secondNiche, thirdNiche].map((niche, i) => (
                  <select
                    key={i}
                    value={niche}
                    onChange={(e) =>
                      [setFirstNiche, setSecondNiche, setThirdNiche][i](
                        e.target.value
                      )
                    }
                    className="w-full border p-2 bg-gray-100 rounded-lg"
                  >
                    <option value="">
                      Select {["First", "Second", "Third"][i]} Niche
                    </option>
                    {nichesArray.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ))}
                <textarea
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  className="w-full border p-2 bg-gray-100 rounded-lg"
                  placeholder="Cover Letter"
                ></textarea>
                <input
                  type="file"
                  onChange={resumeHandler}
                  className="w-full p-2 bg-gray-100 rounded-lg"
                />
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full  bg-gradient-to-br from-[#1B1D3E] to-[#204674] text-white hover:bg-[#204674]"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Register"}
            </Button>
          </form>
          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
