import React from "react";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UserButton() {
  const { t } = useTranslation();
  return (
    <div className="mb-4 mr-3 flex cursor-pointer items-center space-x-2 rounded-full bg-primary p-2 hover:bg-gray-200">
      <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-300">
        <img className="h-full w-full object-cover" />
      </div>
      <span className="flex-grow text-left text-lg font-bold">
        {t("User")}{" "}
      </span>
      <button className="h-8 w-8 rounded-full text-gray-600 hover:bg-gray-600 hover:text-gray-300">
        <Settings className="h-full w-full p-1" />
      </button>
    </div>
  );
}
