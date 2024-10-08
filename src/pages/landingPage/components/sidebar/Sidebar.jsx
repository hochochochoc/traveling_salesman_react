import React from "react";
import UserButton from "./sidebarComponents/UserButton";
import GitHubButton from "./sidebarComponents/GithubButton";
import LanguagesButton from "./sidebarComponents/LanguagesButton";
import AboutButton from "./sidebarComponents/AboutButton";
import ContactButton from "./sidebarComponents/ContactButton";

export default function Sidebar() {
  return (
    <div className="fixed -left-10 top-0 z-50 -ml-10 h-full w-screen bg-egg bg-opacity-80">
      <div className="flex h-full flex-col px-10 py-2">
        <div className="mt-1 font-bold">Sidebar</div>
        <div className="h-8"></div>
        <div className="space-y-1.5">
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
