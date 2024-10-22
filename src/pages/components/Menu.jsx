import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Presentation, Cog, Earth, User } from "lucide-react";
import { useTranslation } from "react-i18next";

const MobileMenu = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  return (
    <div className="fixed bottom-0 left-0 w-full rounded-lg bg-landing2 shadow-lg">
      <div className="flex items-center justify-around rounded-full p-2">
        <button
          className="flex flex-col items-center text-gray-500"
          onClick={() => {
            navigate("/tutorial", {});
          }}
        >
          <Presentation className="h-6 w-6" />
          <span className="mt-1 text-xs">Tutorial</span>
        </button>

        <button
          className="flex flex-col items-center text-gray-500"
          onClick={() => {
            navigate("/menu", {});
          }}
        >
          <Earth className="h-6 w-6" />
          <span className="mt-1 text-xs">{t("countries")}</span>
        </button>
        <button
          className="flex flex-col items-center text-gray-500"
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
        <button className="flex flex-col items-center text-gray-500">
          <User className="h-6 w-6" />
          <span className="mt-1 text-xs">{t("profile")}</span>
        </button>
      </div>
    </div>
  );
};

export default MobileMenu;
