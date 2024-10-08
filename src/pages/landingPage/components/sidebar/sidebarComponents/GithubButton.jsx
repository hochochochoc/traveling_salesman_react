import React from "react";
import { Github } from "lucide-react";

const GitHubButton = ({ href }) => {
  return (
    <a
      href="https://github.com/hochochochoc/traveling_salesman_react"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center rounded-md p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
    >
      <Github size={20} className="mr-3" />
      <span className="text-lg font-bold">GitHub</span>
    </a>
  );
};

export default GitHubButton;
