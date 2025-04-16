import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSavedJobs } from "../store/slices/userSlice";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";

const SavedJobs = () => {
  const dispatch = useDispatch();
  const { savedJobs, loading } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getSavedJobs());
  }, [dispatch]);

  return (
    <div className="flex flex-col md:flex-row items-start justify-center gap-8 p-6">
      {/* Left Side Navigation */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="w-full md:w-1/3 p-6 rounded-2xl shadow-lg bg-gradient-to-br
         from-blue-500 to-indigo-600 text-white space-y-4 
         h-auto text-center sticky top-20"
      >
        <h2 className="text-3xl font-bold">Dashboard</h2>
        <Link
          to="/dashboard"
          className="block w-full text-center py-3 rounded-lg bg-white text-blue-600 font-semibold hover:bg-gray-100 transition-transform transform hover:scale-105"
        >
          Go to Dashboard
        </Link>
        <p className="text-sm leading-relaxed">
          View and manage your saved jobs. Click on job details to apply or
          learn more.
        </p>
      </motion.div>

      {/* Right Side Job Section */}
      <motion.div
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="w-full md:w-2/3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {loading ? (
          <p className="col-span-full text-center text-gray-500">
            Loading saved jobs...
          </p>
        ) : savedJobs && savedJobs.length > 0 ? (
          savedJobs.map((job, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-white shadow-xl rounded-2xl overflow-hidden flex flex-col h-auto p-5 transition-transform transform hover:scale-105 hover:shadow-2xl"
            >
              <div className="flex items-center gap-3 my-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src="https://www.shutterstock.com/image-vector/circle-line-simple-design-logo-600nw-2174926871.jpg" />
                </Avatar>
                <div>
                  <h1 className="font-semibold text-lg">{job.companyName}</h1>
                  <p className="text-sm text-gray-500">{job.location}</p>
                </div>
              </div>
              <h2 className="font-bold text-xl my-2 text-blue-700">
                {job.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {job.introduction}
              </p>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <Badge
                  className="text-blue-700 font-bold bg-blue-100"
                  variant="ghost"
                >
                  12 Positions
                </Badge>
                <Badge
                  className="text-red-600 font-bold bg-red-100"
                  variant="ghost"
                >
                  {job.jobType}
                </Badge>
                <Badge
                  className="text-purple-700 font-bold bg-purple-100"
                  variant="ghost"
                >
                  Rs. {job.salary}
                </Badge>
              </div>
              <div className="flex justify-between mt-auto">
                <Button className="bg-orange-500 text-white hover:bg-orange-600">
                  <Link to={`/job/${job._id}`}>Details</Link>
                </Button>
                <Button className="bg-blue-600 text-white hover:bg-blue-700">
                  <Link to={`/post/application/${job._id}`}>Apply Now</Link>
                </Button>
              </div>
            </motion.div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No saved jobs found.
          </p>
        )}
      </motion.div>
    </div>
  );
};

export default SavedJobs;
