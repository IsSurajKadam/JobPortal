import { motion } from "framer-motion";
import { FiBriefcase, FiCloud, FiRefreshCw } from "react-icons/fi";
import { Button } from "@/components/ui/button";

const NoJobsFound = ({ onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center justify-center p-8 text-center max-w-2xl mx-auto"
    >
      <div className="relative mb-8 ">
        <motion.div
          animate={{
            y: [0, -15, 0],
            transition: {
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          <FiCloud className="w-24 h-24 text-gray-300" />
        </motion.div>
        <FiBriefcase className="w-12 h-12 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        No Job Listings Found
      </h2>
      <p className="text-gray-600 mb-6">
        It looks like this employer hasn't posted any jobs yet. Check back later
        or try refreshing the page.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <FiRefreshCw className="w-4 h-4" />
          Refresh Jobs
        </Button>
        <Button
          onClick={() => window.history.back()}
          variant="ghost"
          className="text-blue-600 hover:bg-blue-50"
        >
          Return to Previous Page
        </Button>
      </div>

      <motion.div
        className="mt-8 text-sm text-gray-400 flex items-center gap-2"
        animate={{
          opacity: [1, 0.5, 1],
          transition: { duration: 2, repeat: Infinity },
        }}
      >
        <FiCloud className="w-4 h-4" />
        <span>All clear in the job cloud!</span>
      </motion.div>
    </motion.div>
  );
};

export default NoJobsFound;
