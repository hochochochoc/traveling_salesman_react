"use client";

import React, { useState, useEffect } from "react";
import { useSidebar } from "../../../../context/SidebarContext";
import UserButton from "./sidebarComponents/UserButton";
import GitHubButton from "./sidebarComponents/GithubButton";
import LanguagesButton from "./sidebarComponents/LanguagesButton";
import AboutButton from "./sidebarComponents/AboutButton";
import ContactButton from "./sidebarComponents/ContactButton";
import { Menu, X } from "lucide-react";

export default function Sidebar() {
  const { isSidebarFunctional } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isSidebarFunctional && !isMobile) {
      const handleMouseMove = (e) => {
        if (e.clientX <= 10) {
          setIsOpen(true);
        }
      };
      document.addEventListener("mousemove", handleMouseMove);
      return () => document.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isMobile, isSidebarFunctional]);

  const sidebarContent = (
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
  );

  if (!isSidebarFunctional) {
    return (
      <div className="fixed left-0 top-0 z-40 h-full w-64 bg-egg shadow-lg">
        {sidebarContent}
      </div>
    );
  }

  return (
    <>
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary-foreground fixed left-4 top-4 z-50 rounded-md bg-primary p-2"
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-64 transform bg-egg shadow-lg transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </div>
      {isOpen && !isMobile && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
          aria-label="Close sidebar"
        ></div>
      )}
    </>
  );
}
