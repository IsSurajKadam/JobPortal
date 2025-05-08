import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="w-full h-[80vh]  flex justify-center items-center">
      <div className="w-full text-center ">
        <h1 className="font-semibold text-8xl">404 Not Found</h1>

        <p className="p-10">
          Your Visited Page Not Found. You may go home page
        </p>
        <Button className="bg-[#7209b7] hover:bg-[#580c8b]">
          <Link to={"/"}>Back to home Page</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
