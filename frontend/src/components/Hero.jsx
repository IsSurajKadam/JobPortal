import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import heroImage from "../assests/webizito-developer.png";

const jobTitles = ["Job", "Career", "Future"];

const HeroSection = () => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const currentWord = jobTitles[wordIndex];

    if (deleting) {
      if (charIndex > 0) {
        setTimeout(() => setCharIndex(charIndex - 1), 100);
      } else {
        setDeleting(false);
        setWordIndex((prev) => (prev + 1) % jobTitles.length);
      }
    } else {
      if (charIndex < currentWord.length) {
        setTimeout(() => setCharIndex(charIndex + 1), 150);
      } else {
        setTimeout(() => setDeleting(true), 1000);
      }
    }

    setDisplayedText(currentWord.slice(0, charIndex));
  }, [charIndex, deleting, wordIndex]);

  const handleSearch = () => {
    navigate(`/jobs?searchKeyword=${searchKeyword.trim()}`);
  };

  return (
    <div className="bg-[#1B1D3E] text-white py-20 px-6 md:px-20 text-center relative">
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className="text-left">
          <h1 className="text-5xl font-bold leading-tight">
            Find Your Dream{" "}
            <motion.span
              className="text-orange-500"
              key={displayedText}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              transition={{ duration: 0.5 }}
            >
              {displayedText}
            </motion.span>
            <span className="text-orange-500">|</span>
            <br /> Anyone, Anywhere
          </h1>
          <p className="text-gray-400 mt-4">
            Web design hackathon accelerator design new style bootstrapping
            branding proposition.
          </p>

          <div className="mt-8 flex items-center gap-2 bg-white rounded-full p-2 w-full md:w-[80%]">
            <input
              type="text"
              placeholder="Search..."
              className="w-full text-black px-4 py-2 outline-none rounded-full"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              className="bg-orange-500 text-white px-6 py-2 rounded-full"
              onClick={handleSearch}
            >
              Find Now
            </button>
          </div>

          <div className="mt-6 text-gray-400">Supported by 3K+ Companies</div>
          <div className="flex gap-6 mt-2">
            <span className="text-white">Google</span>
            <span className="text-white">Airbnb</span>
            <span className="text-white">Netflix</span>
            <span className="text-white">Amazon</span>
          </div>
        </div>

        {/* Hero Image and Side Boxes */}
        <div className="relative max-md:hidden">
          <img src={heroImage} alt="Hero" className="w-[400px] h-[450px]" />
          <div className="absolute top-10 left-0 bg-white text-black px-4 py-2 rounded-lg shadow-md">
            <span className="text-orange-500 font-bold">3K+</span> <br /> Jobs
            Done Successfully
          </div>
          <div className="absolute bottom-10 right-0 bg-white text-black px-4 py-2 rounded-lg shadow-md">
            <span className="text-orange-500 font-bold">12+</span> <br /> Award
            Winner
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
