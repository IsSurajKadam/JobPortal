import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Link } from "react-router-dom";
import { updateProfile, clearAllUpdateProfileErrors } from "@/store/slices/updateProfileSlice";
import { getUser } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { Loader2, User, Mail, Phone, MapPin, Briefcase, FileText } from "lucide-react";

const UpdateProfile = () => {
  const { user } = useSelector((state) => state.user);
  const { loading, error, isUpdated } = useSelector((state) => state.updateProfile);
  const dispatch = useDispatch();

  // Common Fields
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    coverLetter: user?.coverLetter || "",
    niches: {
      firstNiche: user?.niches?.firstNiche || "",
      secondNiche: user?.niches?.secondNiche || "",
      thirdNiche: user?.niches?.thirdNiche || ""
    }
  });

  const [resume, setResume] = useState(null);
  const [resumePreview, setResumePreview] = useState(user?.resume?.url || "");
  const [errors, setErrors] = useState({});

  const nichesArray = [
    "Software Development", "Web Development", "Cybersecurity",
    "Data Science", "Artificial Intelligence", "Cloud Computing",
    "DevOps", "Mobile App Development", "Blockchain",
    "Database Administration"
  ];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllUpdateProfileErrors());
    }
    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      dispatch(getUser());
    }
  }, [dispatch, error, isUpdated]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key === "niches") {
        Object.entries(value).forEach(([nicheKey, nicheValue]) => {
          formPayload.append(nicheKey, nicheValue);
        });
      } else {
        formPayload.append(key, value);
      }
    });

    if (resume) formPayload.append("resume", resume);
    dispatch(updateProfile(formPayload));
  };

  const resumeHandler = (e) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    setResume(file);
    setResumePreview(URL.createObjectURL(file));
  };

  const inputFields = [
    { icon: <User className="w-5 h-5" />, label: "Name", name: "name" },
    { icon: <Mail className="w-5 h-5" />, label: "Email Address", name: "email" },
    { icon: <Phone className="w-5 h-5" />, label: "Phone Number", name: "phone" },
    { icon: <MapPin className="w-5 h-5" />, label: "Address", name: "address" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-xl border border-gray-100"
    >
      <h3 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Update Profile
      </h3>

      <form onSubmit={handleUpdateProfile} className="space-y-6">
        {/* Common Fields */}
        {inputFields.map((field, index) => (
          <motion.div
            key={field.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-600">
                {field.icon}
                {field.label}
              </Label>
              <Input
                value={formData[field.name]}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className={`w-full ${errors[field.name] ? "border-red-500" : ""}`}
              />
              {errors[field.name] && (
                <p className="text-red-500 text-sm">{errors[field.name]}</p>
              )}
            </div>
          </motion.div>
        ))}

        {/* Job Seeker Fields */}
        {user?.role === "Job Seeker" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <Label className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-5 h-5" />
                Preferred Job Niches
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(formData.niches).map((nicheKey, index) => (
                  <div key={nicheKey} className="relative">
                    <select
                      value={formData.niches[nicheKey]}
                      onChange={(e) => setFormData({
                        ...formData,
                        niches: { ...formData.niches, [nicheKey]: e.target.value }
                      })}
                      className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                      <option value="">Select Niche</option>
                      {nichesArray.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-600">
                <FileText className="w-5 h-5" />
                Cover Letter
              </Label>
              <textarea
                rows="4"
                value={formData.coverLetter}
                onChange={(e) => setFormData({ ...formData, coverLetter: e.target.value })}
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-gray-600">
                <FileText className="w-5 h-5" />
                Resume
              </Label>
              <div className="flex items-center gap-4">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="file"
                    onChange={resumeHandler}
                    className="hidden"
                    accept="application/pdf"
                  />
                  <div className="w-full p-2.5 border rounded-lg hover:bg-gray-50 transition-colors text-center">
                    {resume ? "Change File" : "Upload Resume (PDF)"}
                  </div>
                </label>
                {resumePreview && (
                  <Link
                    to={resumePreview}
                    target="_blank"
                    className="text-blue-600 hover:underline"
                  >
                    View Current
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="pt-6"
        >
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-6 text-lg"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving Changes...
              </div>
            ) : (
              "Update Profile"
            )}
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default UpdateProfile;