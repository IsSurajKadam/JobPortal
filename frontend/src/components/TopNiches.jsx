import React from "react";
import { Link } from "react-router-dom";
import firstCategeroy from "../assests/firstc.jpg";
import seondCategory from "../assests/secondc.jpg";

const TopNiches = () => {
  const categories = [
    {
      id: 1,
      company: "Patch",
      title: "UI/UX Designer",
      jobs: "150+ Jobs",
      image: firstCategeroy,
    },
    {
      id: 2,
      company: "Slack",
      title: "Marketing",
      jobs: "800+ Jobs",
      image: seondCategory,
    },
    {
      id: 3,
      company: "Tik Tok",
      title: "Backend Developer",
      jobs: "750+ Jobs",
      image: firstCategeroy,
    },
    {
      id: 4,
      company: "Apple",
      title: "App Development",
      jobs: "350+ Jobs",
      image: firstCategeroy,
    },
    {
      id: 5,
      company: "Airbnb",
      title: "Developer",
      jobs: "450+ Jobs",
      image: seondCategory,
    },
    {
      id: 6,
      company: "Google",
      title: "Data Verification",
      jobs: "850+ Jobs",
      image: firstCategeroy,
    },
  ];

  return (
    <div className="text-center py-10 bg-[#F9F9FB]">
      <h2 className="text-4xl font-bold">
        Our Popular Jobs <span className="text-orange-500">Category</span>
      </h2>
      <p className="text-gray-600 mt-2">
        Success vesting period channels beta android iteration sales influencer
        android responsive web design.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 max-w-6xl mx-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            className="bg-white shadow-lg rounded-lg overflow-hidden"
          >
            <div className="relative">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-40 object-cover"
              />
              <span className="absolute top-3 left-3 bg-gray-900 text-white px-3 py-1 rounded-lg">
                {category.company}
              </span>
            </div>
            <div className="p-4 text-left">
              <h3 className="text-lg font-bold">{category.title}</h3>
              <p className="text-gray-500">{category.jobs}</p>
              <button className="mt-2 px-4 py-2 bg-yellow-400 text-white font-bold rounded-md w-full hover:bg-yellow-500">
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
      <Link to="/jobs">
        <button className="mt-6 px-6 py-3 bg-orange-500 text-white font-bold rounded-md hover:bg-orange-600">
          View All Job
        </button>
      </Link>
    </div>
  );
};

export default TopNiches;
