import React from "react";
import UserButton from "./sidebarComponents/UserButton";
import GitHubButton from "./sidebarComponents/GithubButton";
import LanguagesButton from "./sidebarComponents/LanguagesButton";
import AboutButton from "./sidebarComponents/AboutButton";
import ContactButton from "./sidebarComponents/ContactButton";

export default function Sidebar({ onClose }) {
  return (
    <div className="fixed -left-10 top-16 z-50 ml-10 h-full w-screen bg-egg bg-opacity-95">
      <div className="flex h-full flex-col py-4 pl-6 pr-3">
        <div className="mr-1 flex items-center justify-end md:mr-5"></div>

        <div className="mt-12 space-y-1.5">
          <AboutButton />
          <LanguagesButton />
          <GitHubButton />
          <ContactButton />
        </div>
        <div className="h-28"></div>
        <UserButton />
      </div>
    </div>
  );
}
