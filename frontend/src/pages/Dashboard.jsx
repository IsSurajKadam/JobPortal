import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Sidebar from "../components/Sidebar";
import MyProfile from "@/components/MyProfile";
import UpdateProfile from "@/components/UpdateProfile";
import UpdatePassword from "@/components/UpdatePassword";
import MyJobs from "@/components/MyJobs";
import MyApplications from "@/components/MyApplications";
import Applications from "@/components/Applications";
import JobPost from "@/components/JobPost";
import UserInterviewsList from "../components/UserInterviewsList";
import SavedJobs from "@/components/SavedJobs";
import AdminUsersList from "@/components/AdminUsersList";
import AdminReports from "@/components/AdminReports";
import { getBlockedEmployers } from "@/store/slices/adminSlice";

const Dashboard = () => {
  const [componentName, setComponentName] = useState("My Profile");
  const { loading, message, blockedEmployers } = useSelector(
    (state) => state.admin
  );
  const { isAuthenticated, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigateTo = useNavigate();

  const hasRegistered = useRef(false); // Prevent duplicate event listeners

  // Fetch blocked employers when Dashboard loads or when message updates
  useEffect(() => {
    dispatch(getBlockedEmployers());

    if (error) {
      toast.error(error);
      dispatch(clearAdminErrors());
    }
    if (message) {
      toast.success(message);
    }
  }, [dispatch, error, message]);

  // Store previous blocked employers to avoid unnecessary re-renders

  const renderComponent = () => {
    switch (componentName) {
      case "My Profile":
        return <MyProfile />;
      case "Update Profile":
        return <UpdateProfile />;
      case "Update Password":
        return <UpdatePassword />;
      case "My Jobs":
        return <MyJobs />;
      case "My Applications":
        return <MyApplications />;
      case "Applications":
        return <Applications />;
      case "Job Post":
        return <JobPost />;
      case "myInterviews":
        return <UserInterviewsList />;
      case "savedJobs":
        return navigateTo("/saved-jobs");
      case "Users":
        return <AdminUsersList />;
      case "Reports":
        return <AdminReports />;
      default:
        return <MyProfile />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto flex gap-6">
      <Sidebar setComponentName={setComponentName} />
      <div className="flex-1 p-5 bg-white shadow-lg rounded-lg">
        {renderComponent()}
      </div>
    </div>
  );
};

export default Dashboard;
