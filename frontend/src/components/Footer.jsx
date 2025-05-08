import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FaSquareInstagram,  FaSquareXTwitter, } from "react-icons/fa6";
import {

  FaYoutube,
  FaLinkedin,
  FaMapMarkerAlt,
  FaEnvelope,
  FaPhoneAlt,
  FaHome,
  FaBriefcase,
  FaUser,
} from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.user);

  const socialLinks = [
    { icon: <FaSquareInstagram />, color: "text-pink-500", label: "Instagram" },
    { icon: <FaSquareXTwitter />, color: "text-black", label: "Twitter" },
    { icon: <FaYoutube />, color: "text-red-600", label: "YouTube" },
    { icon: <FaLinkedin />, color: "text-blue-600", label: "LinkedIn" },
  ];

  return (
    <footer className="w-full bg-[#1B1D3E] text-white py-12 px-4 md:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo Section */}
        <div className="mb-8 md:mb-0">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            JobPortal
          </h1>
          <p className="mt-4 text-gray-300">
            Connecting talent with opportunity
          </p>
        </div>

        {/* Support Section */}
        <div className="mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaMapMarkerAlt className="mr-2 text-blue-400" />
            Support
          </h2>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-300 hover:text-white transition-colors">
              <FiMapPin className="mr-2 text-blue-400" />
              Street 007, Shichaya Kannamwar Nagar 2, Vikhroli Mumbai
            </li>
            <li className="flex items-center text-gray-300 hover:text-white transition-colors">
              <FiMail className="mr-2 text-blue-400" />
              surajkadam1706004@gmail.com
            </li>
            <li className="flex items-center text-gray-300 hover:text-white transition-colors">
              <FiPhone className="mr-2 text-blue-400" />
              +91 93218 03014
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="mb-8 md:mb-0">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaBriefcase className="mr-2 text-blue-400" />
            Quick Links
          </h2>
          <ul className="space-y-3">
            <li className="hover:text-blue-400 transition-colors">
              <Link to="/" className="flex items-center">
                <FaHome className="mr-2" />
                Home
              </Link>
            </li>
            <li className="hover:text-blue-400 transition-colors">
              <Link to="/jobs" className="flex items-center">
                <FaBriefcase className="mr-2" />
                Jobs
              </Link>
            </li>
            {isAuthenticated && (
              <li className="hover:text-blue-400 transition-colors">
                <Link to="/dashboard" className="flex items-center">
                  <FaUser className="mr-2" />
                  Dashboard
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Follow Us */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FaUser className="mr-2 text-blue-400" />
            Follow Us
          </h2>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href="#"
                className={`text-2xl hover:scale-110 transition-transform ${social.color}`}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
        <p>© {new Date().getFullYear()} JobPortal. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
