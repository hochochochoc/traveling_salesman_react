import React, { useState } from "react";
import {
  HomeIcon,
  UserIcon,
  CogIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white shadow-lg">
      {!isOpen ? (
        <button
          className="flex w-full items-center justify-center p-4"
          onClick={toggleMenu}
        >
          <HomeIcon className="h-6 w-6 text-gray-600" />
        </button>
      ) : (
        <div className="flex items-center justify-around p-2">
          <button className="flex flex-col items-center" onClick={toggleMenu}>
            <HomeIcon className="h-6 w-6 text-gray-600" />
            <span className="mt-1 text-xs">Home</span>
          </button>
          <button className="flex flex-col items-center">
            <UserIcon className="h-6 w-6 text-gray-600" />
            <span className="mt-1 text-xs">Profile</span>
          </button>
          <button className="flex flex-col items-center">
            <CogIcon className="h-6 w-6 text-gray-600" />
            <span className="mt-1 text-xs">Countries</span>
          </button>
          <button className="flex flex-col items-center">
            <InformationCircleIcon className="h-6 w-6 text-gray-600" />
            <span className="mt-1 text-xs">Algorithms</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileMenu;
