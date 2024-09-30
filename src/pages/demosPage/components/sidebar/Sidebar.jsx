import React, { useState, useEffect } from "react";
import UserButton from "./sidebarComponents/UserButton";
import GitHubButton from "./sidebarComponents/GithubButton";
import LanguagesButton from "./sidebarComponents/LanguagesButton";
import AboutButton from "./sidebarComponents/AboutButton";
import ContactButton from "./sidebarComponents/ContactButton";

export default function Sidebar() {
  return (
    <>
      <div className="fixed left-0 top-0 z-40 h-full w-64 translate-x-0 transform bg-egg shadow-lg transition-transform duration-300 ease-in-out">
        <div className="flex h-screen flex-col p-4">
          <div className="mt-1 font-bold">Sidebar</div>
          <div className="h-10"></div>
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
    </>
  );
}
