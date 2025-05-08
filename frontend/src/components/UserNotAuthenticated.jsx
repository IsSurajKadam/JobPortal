import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const UserNotAuthenticated = () => {
  const [redirectCountdown, setRedirectCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          navigate("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50 text-center">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
        🔒 Authentication Required
      </h1>

      <p className="text-lg text-gray-600 mb-6">
        You need to be logged in to access this page
      </p>

      <div className="text-gray-700 mb-8">
        Redirecting to homepage in
        <span className="font-bold mx-1 text-blue-600">
          {redirectCountdown}
        </span>
        seconds...
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/login"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:ring-offset-2"
          aria-label="Log in to your account"
        >
          Log In
        </Link>

        <Link
          to="/register"
          className="px-6 py-3 bg-green-600 text-white rounded-lg
                     hover:bg-green-700 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-green-500
                     focus:ring-offset-2"
          aria-label="Create new account"
        >
          Sign Up
        </Link>
      </div>

      <div className="mt-8 text-sm text-gray-500">
        Having trouble?{" "}
        <button
          onClick={() => navigate("/help")}
          className="text-blue-600 hover:underline focus:outline-none"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default UserNotAuthenticated;
