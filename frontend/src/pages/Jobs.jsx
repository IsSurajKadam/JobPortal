import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { clearAllJobErrors, fetchJobs } from "../store/slices/jobSlice";
import { saveJob, unsaveJob } from "@/store/slices/userSlice";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Bookmark, Search, BookmarkCheck, Filter } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import NoJobsFound from "@/components/NoJobsFound";

const Jobs = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [city, setCity] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [niche, setNiche] = useState("");
  const [selectedNiche, setSelectedNiche] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [showSidebar, setShowSidebar] = useState(false); // Sidebar visibility for mobile

  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const { savedJobs, isAuthenticated } = useSelector((state) => state.user);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 120, damping: 10 },
    },
    hover: { scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" },
  };

  const filterVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const staggerVariants = {
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const cities = [
    "All", "Bengaluru", "Hyderabad", "Pune", "Chennai", 
    "Mumbai", "Delhi", "Noida", "Gurgaon", "Kolkata", "Ahmedabad"
  ];

  const nichesArray = [
    "Software Development", "Web Development", "Cybersecurity",
    "Data Science", "Artificial Intelligence", "Cloud Computing",
    "DevOps", "Mobile App Development", "Blockchain",
    "Database Administration", "Network Administration"
  ];

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearAllJobErrors());
    }
    dispatch(fetchJobs(city, niche, searchKeyword));
  }, [dispatch, error, city, niche, searchKeyword]);

  const handleSearch = () => dispatch(fetchJobs(city, niche, searchKeyword));

  const handleCityChange = (city) => {
    setCity(city === "All" ? "" : city);
    setSelectedCity(city);
    setShowSidebar(false);
  };

  const handleNicheChange = (niche) => {
    setNiche(niche);
    setSelectedNiche(niche);
    setShowSidebar(false);
  };

  const handleDetails = (jobId) => navigate(`/job/${jobId}`);

  const handleSaveJob = (jobId) => {
    if (!isAuthenticated) return toast.error("Please login to save jobs");
    savedJobs.includes(jobId)
      ? dispatch(unsaveJob(jobId))
      : dispatch(saveJob(jobId));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Search Section */}
      <motion.section
        className="bg-gradient-to-r from-[#1B1D3E] to-[#2D3268] py-12 md:py-16"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="container mx-auto px-4">
          <motion.div
            className="w-full md:w-3/4 lg:w-1/2 mx-auto"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
          >
            <div className="flex items-center bg-white shadow-xl rounded-full px-6 py-3 space-x-4">
              <Search className="h-6 w-6 text-gray-400" />
              <input
                type="text"
                placeholder="Find your dream job..."
                className="w-full bg-transparent outline-none text-lg placeholder-gray-400"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                className="rounded-full bg-[#1B1D3E] px-8 py-6 hover:bg-[#13152E]"
                onClick={handleSearch}
              >
                <Search className="h-5 w-5 text-white" />
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-6 relative">
          {/* Toggle Button for Mobile */}
          <div className="lg:hidden mb-4">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setShowSidebar(!showSidebar)}
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Filters Sidebar */}
          <AnimatePresence>
            {(showSidebar || window.innerWidth >= 1024) && (
              <motion.aside
                key="sidebar"
                variants={filterVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="absolute z-20 lg:static w-full lg:w-72 xl:w-80 bg-white shadow-xl rounded-2xl p-6 lg:block"
              >
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl font-bold mb-4">Filter by City</h2>
                    <div className="grid grid-cols-1 gap-2">
                      {cities.map((city) => (
                        <motion.button
                          key={city}
                          whileHover={{ x: 5 }}
                          className={`text-left px-4 py-2 rounded-lg ${
                            selectedCity === city
                              ? 'bg-[#1B1D3E] text-white'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleCityChange(city)}
                        >
                          {city}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold mb-4">Filter by Niche</h2>
                    <div className="grid grid-cols-1 gap-2">
                      {nichesArray.map((niche) => (
                        <motion.button
                          key={niche}
                          whileHover={{ x: 5 }}
                          className={`text-left px-4 py-2 rounded-lg ${
                            selectedNiche === niche
                              ? 'bg-[#1B1D3E] text-white'
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => handleNicheChange(niche)}
                        >
                          {niche}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Job Cards Grid */}
          <div className="flex-1">
            <LayoutGroup>
              {loading ? (
                <div className="flex justify-center p-8">
                  <Spinner />
                </div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  variants={staggerVariants}
                >
                  <AnimatePresence>
                    {jobs?.length > 0 ? (
                      jobs.map((job) => (
                        <motion.article
                          key={job._id}
                          layout
                          variants={cardVariants}
                          whileHover="hover"
                          className="bg-white shadow-md rounded-2xl overflow-hidden"
                        >
                          <div className="p-6 space-y-4">
                            {/* Header */}
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 rounded-lg">
                                  <AvatarImage src={job.companyLogo} />
                                </Avatar>
                                <div>
                                  <h3 className="font-bold text-lg">{job.companyName}</h3>
                                  <p className="text-sm text-gray-500">{job.location}</p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleSaveJob(job._id)}
                              >
                                {savedJobs.includes(job._id) ? (
                                  <BookmarkCheck className="h-5 w-5 text-blue-500" />
                                ) : (
                                  <Bookmark className="h-5 w-5" />
                                )}
                              </Button>
                            </div>

                            {/* Job Details */}
                            <div>
                              <h2 className="text-xl font-bold mb-2">{job.title}</h2>
                              <p className="text-gray-600 line-clamp-3 mb-4">
                                {job.introduction}
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary">{job.jobType}</Badge>
                                <Badge variant="secondary">
                                  {job.positions} Positions
                                </Badge>
                                <Badge variant="secondary">₹{job.salary}</Badge>
                              </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-4 border-t border-gray-100">
                              <div className="flex justify-between items-center">
                                <Button
                                  variant="outline"
                                  onClick={() => handleDetails(job._id)}
                                >
                                  Details
                                </Button>
                                <Button asChild className="bg-[#1B1D3E] hover:bg-[#13152E]">
                                  <Link to={`/post/application/${job._id}`}>
                                    Apply Now
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.article>
                      ))
                    ) : (
                      <motion.div
                        className="col-span-full"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <NoJobsFound onRetry={handleSearch} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </LayoutGroup>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default Jobs;
