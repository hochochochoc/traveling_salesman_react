import React from "react";
import { Info } from "lucide-react";

const AboutButton = () => {
  return (
    <a
      href={"/about"}
      className="flex items-center rounded-md p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
    >
      <Info size={20} className="mr-3" />
      <span className="text-sm font-medium">About</span>
    </a>
  );
};

export default AboutButton;
