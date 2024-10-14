import React from "react";
import { Info } from "lucide-react";

const AboutButton = () => {
  return (
    <a href={"/about"} className="flex items-center p-2 text-gray-900">
      <span className="text-2xl font-semibold">About</span>
    </a>
  );
};

export default AboutButton;
