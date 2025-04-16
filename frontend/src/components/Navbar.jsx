import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/userSlice";
import { toast } from "react-toastify";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logout successfully");
    setMenuOpen(false);
  };

  return (
    <div className="bg-[#1B1D3E] text-white py-4 px-6 md:px-20 flex justify-between items-center shadow-md relative">
      {/* Logo */}
      <h1 className="text-2xl font-bold">
        Job<span className="text-orange-500">Portal</span>
      </h1>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={30} /> : <Menu size={30} />} {/* Toggle Icon */}
      </button>

      {/* Navbar Links (Responsive) */}
      <div
        className={`absolute top-16 left-0 w-full  bg-[#1B1D3E] md:static md:flex md:w-auto md:bg-transparent z-50 p-4 md:ml-auto ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="flex flex-col md:flex-row gap-6 font-medium text-center md:text-left">
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/jobs" onClick={() => setMenuOpen(false)}>
              Jobs
            </Link>
          </li>
          <li>
            <Link to="/browse" onClick={() => setMenuOpen(false)}>
              Browse
            </Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
          </li>
        </ul>

        {/* Auth Section (Only in Mobile) */}
        {isAuthenticated ? (
          <div className="flex flex-col items-center md:hidden gap-4 mt-4">
            <Link
              to="/dashboard"
              className="bg-orange-500 px-4 py-2 rounded-lg w-full text-center"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button
              className="bg-orange-500 px-4 py-2 rounded-lg w-full"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center md:hidden gap-4 mt-4">
            <Link
              to="/login"
              className="border border-white px-4 py-2 rounded-lg w-full text-center"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-orange-500 px-4 py-2 rounded-lg w-full text-center"
              onClick={() => setMenuOpen(false)}
            >
              Signup
            </Link>
          </div>
        )}
      </div>

      {/* Auth Section (Desktop Only) */}
      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <button
              className="bg-orange-500 px-4 py-2 rounded-lg"
              onClick={handleLogout}
            >
              Logout
            </button>

            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent>
                <div className="flex gap-2 items-center">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                  </Avatar>
                  <div>
                    <p className="text-gray-600">{user?.name}</p>
                    <p className="text-gray-600 text-xs">{user?.role}</p>
                  </div>
                </div>
                <p className="text-gray-600">{user?.email}</p>
                <div className="my-2">
                  <Link
                    to="/dashboard"
                    className="block bg-orange-500 text-center px-4 py-2 rounded-lg"
                  >
                    Dashboard
                  </Link>
                </div>
              </PopoverContent>
            </Popover>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="border border-white px-4 py-2 rounded-lg"
            >
              Login
            </Link>
            <Link to="/register" className="bg-orange-500 px-4 py-2 rounded-lg">
              Signup
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
