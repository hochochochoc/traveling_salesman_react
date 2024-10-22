import React from "react";

const GitHubButton = ({ href }) => {
  return (
    <a
      href="https://github.com/hochochochoc/traveling_salesman_react"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center rounded-md p-2 text-gray-200"
    >
      <span className="text-2xl font-semibold">GitHub</span>
    </a>
  );
};

export default GitHubButton;
