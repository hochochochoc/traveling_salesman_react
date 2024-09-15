import React from "react";
import UserButton from "./sidebarComponents/UserButton";
import GitHubButton from "./sidebarComponents/GithubButton";
import LanguagesButton from "./sidebarComponents/LanguagesButton";
import AboutButton from "./sidebarComponents/AboutButton";
import ContactButton from "./sidebarComponents/ContactButton";

export default function Sidebar() {
  return (
    <div className="h-screen bg-egg p-4">
      <div className="mt-1 font-bold">Sidebar</div>
      <div className="h-10"></div>
      <div className="space-y-1.5">
        <AboutButton />
        <LanguagesButton />
        <GitHubButton />
        <ContactButton />
      </div>

      <div className="h-40"></div>
      <div className="h-40"></div>
      <div className="h-40"></div>
      <div className="h-8"></div>
      <UserButton />
    </div>
  );
}
