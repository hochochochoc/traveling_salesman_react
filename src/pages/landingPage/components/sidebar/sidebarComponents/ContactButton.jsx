import React from "react";
import { Notebook } from "lucide-react";

const ContactButton = ({ href = "/contact" }) => {
  return (
    <a
      href={href}
      className="flex items-center rounded-md p-2 text-gray-700 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
    >
      <Notebook size={20} className="mr-3" />
      <span className="text-lg font-bold">Contact</span>
    </a>
  );
};

export default ContactButton;
