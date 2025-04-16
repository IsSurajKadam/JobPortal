import React from "react";
import ErrorImage from "../components/Error.png";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Forbidden = () => {
  const imge = "Error.png";
  return (
    <div>
      <div className="w-full h-[92vh] flex mt-20 items-center flex-col gap-5">
        <img src={ErrorImage} className="w-[600px] h-[400px] " />
        <div>
          <h1 className="text-4xl font-bold">
            Employer & UnAuthorized User Cannot Asscess This Page
          </h1>
        </div>
        <div className="m-5">
          <Button className="w-64 bg-[#7209b7]">
            <Link to={"/"}>Back To Home Page</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
