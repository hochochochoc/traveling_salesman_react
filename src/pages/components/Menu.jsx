import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Presentation, Cog, Earth, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const MobileMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Helper function to determine if a path is active
  const isActive = (path) => {
    if (path === "/tutorial" && location.pathname === "/") {
      return true; // For initial state
    }
    return location.pathname === path;
  };

  // Button style generator
  const getButtonStyle = (path) => {
    return `flex flex-col items-center ${
      isActive(path) ? "text-white" : "text-gray-500"
    }`;
  };

  return (
    <div className="fixed bottom-0 left-0 w-full rounded-t-lg bg-landing2 shadow-lg">
      <div className="flex items-center justify-around rounded-full p-2">
        <button
          className={getButtonStyle("/tutorial")}
          onClick={() => {
            navigate("/tutorial", {});
          }}
        >
          <Presentation className="h-6 w-6" />
          <span className="mt-1 text-xs">Tutorial</span>
        </button>

        <button
          className={getButtonStyle("/menu")}
          onClick={() => {
            navigate("/menu", {});
          }}
        >
          <Earth className="h-6 w-6" />
          <span className="mt-1 text-xs">{t("countries")}</span>
        </button>

        <button
          className={getButtonStyle("/demos")}
          onClick={() => {
            navigate("/demos", {
              state: {
                activeSection: "algorithms",
                algorithmSelection: "Greedy",
                validationSelection: "Prims",
              },
            });
          }}
        >
          <Cog className="h-6 w-6" />
          <span className="mt-1 text-xs">{t("algorithms")}</span>
        </button>

        <button
          className={getButtonStyle("/profile")}
          onClick={() => {
            navigate("/profile", {});
          }}
        >
          <User className="h-6 w-6" />
          <span className="mt-1 text-xs">{t("profile")}</span>
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
