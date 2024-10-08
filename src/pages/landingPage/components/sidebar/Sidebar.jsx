import React from "react";
import { X } from "lucide-react"; // Import the X icon for closing
import UserButton from "./sidebarComponents/UserButton";
import GitHubButton from "./sidebarComponents/GithubButton";
import LanguagesButton from "./sidebarComponents/LanguagesButton";
import AboutButton from "./sidebarComponents/AboutButton";
import ContactButton from "./sidebarComponents/ContactButton";

export default function Sidebar({ onClose }) {
  return (
    <div className="fixed -left-10 top-0 z-50 -ml-10 h-full w-screen bg-egg bg-opacity-95">
      <div className="flex h-full flex-col py-8 pl-6 pr-5">
        <div className="flex items-center justify-between">
          <div className="mt-1 text-lg font-extrabold"></div>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-x"
            onClick={onClose}
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </div>

        <div className="mt-12 space-y-1.5">
          <AboutButton />
          <LanguagesButton />
          <GitHubButton />
          <ContactButton />
        </div>
        <div className="flex-grow"></div>
        <UserButton />
      </div>
    </div>
  );
}
