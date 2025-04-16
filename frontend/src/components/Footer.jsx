import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaSquareXTwitter,
  FaSquareInstagram,
  FaYoutube,
  FaLinkedin,
} from "react-icons/fa6";

const Footer = () => {
  const { isAuthenticated } = useSelector((state) => state.user);
  return (
    <div className="w-full  flex justify-evenly pt-10 text-white bg-[#1B1D3E]">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Logo</h1>
      </div>
      <div>
        <h2 className="text-2xl font-semibold">Support</h2>
        <ul className="">
          <li className="cursor-pointer p-1">
            Streen 007 Shichaya kannamwar nagar 2,vikhroli mumbai{" "}
          </li>
          <li className="cursor-pointer p-1">surajkadam1706004@gmail.com</li>
          <li className="cursor-pointer p-1">+919321803014</li>
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-semibold">Quick Links</h2>
        <ul>
          <li className="cursor-pointer p-1">
            <Link to={"/"}>Home</Link>
          </li>
          <li className="cursor-pointer p-1">
            <Link to={"/jobs"}>Jobs</Link>
          </li>
          {isAuthenticated && (
            <li className="cursor-pointer p-1">
              <Link to={"/dashboard"}>Dashboard</Link>
            </li>
          )}
        </ul>
      </div>
      <div>
        <h2 className="text-2xl font-semibold">Follow us</h2>
        <ul>
          <li className="cursor-pointer p-1">Instagram</li>
          <li className="cursor-pointer p-1">Twitter</li>
          <li className="cursor-pointer p-1">Facebook</li>
          <li className="cursor-pointer p-1">LinkedIn</li>
        </ul>
      </div>
    </div>
  );
};

export default Footer;
