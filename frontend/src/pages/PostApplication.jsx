import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
  clearAllApplicationErrors,
  postApplication,
  resetApplicationSlice,
} from "../store/slices/applicationSlice";
import { toast } from "react-toastify";
import { fetchSingleJob } from "../store/slices/jobSlice";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Forbidden from "./Forbidden";

const PostApplication = () => {
  const { singleJob } = useSelector((state) => state.jobs);
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { loading, error, message } = useSelector((state) => state.applications);

  const { jobId } = useParams();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resume, setResume] = useState("");

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  const handlePostApplication = (e) => {
    e.preventDefault();
    if (!resume) {
      toast.error("Please update your profile and upload your resume.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("coverLetter", coverLetter);
    formData.append("resume", resume);
    dispatch(postApplication(formData, jobId));
  };

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
      setCoverLetter(user.coverLetter || "");
      setResume(user.resume?.url || "");
    }
    if (error) {
      toast.error(error);
      dispatch(clearAllApplicationErrors());
    }
    if (message) {
      toast.success(message);
      dispatch(resetApplicationSlice());
    }
    dispatch(fetchSingleJob(jobId));
  }, [dispatch, error, message, jobId, user]);

  return (
    <div>
      {isAuthenticated && user.role === "Job Seeker" ? (
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between my-10 gap-5">
          <div className="w-full md:w-1/2">
            <form className="border w-[95%] px-10">
              <h2 className="font-semibold text-2xl py-5">Application Form</h2>

              <div>
                <Label className="font-normal text-[17px] block py-4">Job Title</Label>
                <Input
                  type="text"
                  className="max-w-[95%] font-semibold bg-slate-100"
                  placeholder={singleJob.title}
                  disabled
                />
              </div>

              <div>
                <Label className="font-normal text-[17px] block py-4">Your Name</Label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="tracking-wider max-w-[95%]"
                />
              </div>

              <div>
                <Label className="font-normal text-[17px] block py-4">Email</Label>
                <Input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="tracking-wider max-w-[95%]"
                />
              </div>

              <div>
                <Label className="font-normal text-[17px] block py-4">Phone Number</Label>
                <Input
                  type="number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="tracking-wider max-w-[95%]"
                />
              </div>

              <div>
                <Label className="font-normal text-[17px] block py-4">Address</Label>
                <Input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="tracking-wider max-w-[95%]"
                />
              </div>

              <div>
                <Label className="font-normal text-[17px] block py-4">Cover Letter</Label>
                <textarea
                  rows="5"
                  className="border w-[95%]"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                ></textarea>
              </div>

              <div>
                <Label className="font-normal text-[17px] block py-4">Resume</Label>
                {resume ? (
                  <div className="flex items-center gap-4">
                    <Button
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                      onClick={() => window.open(resume, "_blank")}
                    >
                      Preview Resume
                    </Button>
                  </div>
                ) : (
                  <p className="text-red-500">
                    Please update your profile and upload your resume.
                  </p>
                )}
              </div>

              {isAuthenticated && user.role === "Job Seeker" && resume ? (
                singleJob?.applicant?.includes(user._id) ? (
                  <div className="my-5 text-gray-500 font-semibold">
                    Already Applied
                  </div>
                ) : (
                  <div className="my-5">
                    <Button
                      onClick={handlePostApplication}
                      className="w-[95%] bg-[#7209b7] hover:bg-[#530b84]"
                      disabled={loading}
                    >
                      Apply
                    </Button>
                  </div>
                )
              ) : (
                <div className="my-5">
                  <Button
                    onClick={handlePostApplication}
                    className="w-[95%] bg-[#7209b7] hover:bg-[#530b84] hidden"
                    disabled={loading}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Job Details (Hidden on mobile view) */}
          <div className="w-full md:w-1/2 hidden md:block">
            <header>
              <h3 className="text-2xl font-semibold py-5">{singleJob.title}</h3>
              <p className="text-gray-600">{singleJob.location}</p>
              <p className="text-gray-600">Rs. {singleJob.salary} a month</p>
            </header>
            <hr className="mt-5" />

            <div>
              <h3 className="text-2xl font-semibold">Full Job Description</h3>
              <p className="text-gray-600 pt-2">{singleJob.introduction}</p>
            </div>

            <hr className="my-5" />
            <div>
              <h3 className="text-2xl font-semibold">Job Niche</h3>
              <p className="text-gray-600">{singleJob.jobNiche}</p>
            </div>
          </div>
        </div>
      ) : (
        <Forbidden />
      )}
    </div>
  );
};

export default PostApplication;
