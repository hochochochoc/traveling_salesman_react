import React from "react";
import { Notebook } from "lucide-react";

const ContactButton = ({ href = "/contact" }) => {
  return (
    <a href={href} className="flex items-center rounded-md p-2 text-gray-900">
      <span className="text-2xl font-semibold">Contact</span>
    </a>
  );
};

export default ContactButton;
