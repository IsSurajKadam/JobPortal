import React, { useEffect } from "react";
//import "./App.css";

import { logout } from "./store/slices/userSlice";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Jobs from "./pages/Jobs";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import PostApplication from "./pages/PostApplication";
import Register from "./pages/Register";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/userSlice";
import ScheduleInterviewForm from "./components/ScheduleInterviewForm";
import { Button } from "./components/ui/button";
import About from "./pages/About";
import JobDetails from "./components/JobDetails";
import SavedJobs from "./components/SavedJobs";
import AdminEmployerJobs from "./components/AdminEmployerJobs";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, error, user } = useSelector((state) => state.user);
  console.log(user);

  useEffect(() => {
    dispatch(getUser());
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (user.isBlocked) {
        dispatch(logout());
        location.href = "/login";
      }
    }
  }, [user, error]);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/about" element={<About />} />

          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/post/application/:jobId"
            element={<PostApplication />}
          />
          <Route path="/job/:jobId" element={<JobDetails />} />
          <Route
            path="/schedule/:applicationId/:jobId/:candidateId"
            element={<ScheduleInterviewForm />}
          />
          <Route path="/employer/:employerId" element={<AdminEmployerJobs />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/saved-jobs" element={<SavedJobs />} />
        </Routes>
        <Footer />
        <ToastContainer position="top-right" theme="dark" />
      </Router>
    </>
  );
};

export default App;
