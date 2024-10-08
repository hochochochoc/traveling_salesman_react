import React from "react";
import { Info } from "lucide-react";

const AboutButton = () => {
  return (
    <a
      href={"/about"}
      className="flex items-center rounded-md p-2 font-bold text-gray-700 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="lucide lucide-info mr-3"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <span className="text-lg font-bold">About</span>
    </a>
  );
};

export default AboutButton;
