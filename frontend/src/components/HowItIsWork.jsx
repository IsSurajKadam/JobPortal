import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { UserPlus, Briefcase, CheckCircle } from "lucide-react";

const HowItIsWork = () => {
  const HowWork = [
    {
      id: 1,
      icon: <UserPlus size={40} className="text-[#F97316]" />,
      title: "Account",
      description: "Web design hack accelerator branding value.",
    },
    {
      id: 2,
      icon: <Briefcase size={40} className="text-[#F97316]" />,
      title: "CV/Resume",
      description: "Web design hack accelerator branding value.",
    },
    {
      id: 3,
      icon: <CheckCircle size={40} className="text-[#F97316]" />,
      title: "Quick Job",
      description: "Web design hack accelerator branding value.",
    },
  ];

  return (
    <div className="bg-[#204674] text-white py-16 px-6 mt-[-50px]">
      <h4 className="text-4xl font-bold text-center">How it Works</h4>
      <div className="max-w-7xl mx-auto mt-12 grid md:grid-cols-3 gap-6">
        {HowWork.map((item) => (
          <Card
            key={item.id}
            className="bg-[#204674] p-6 rounded-lg shadow-md text-center"
          >
            <CardHeader className="flex flex-col items-center">
              <div className="bg-[#FFFFFF] p-4 rounded-full mb-4">
                {item.icon}
              </div>
              <CardTitle className="text-xl font-semibold text-white">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">{item.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HowItIsWork;
