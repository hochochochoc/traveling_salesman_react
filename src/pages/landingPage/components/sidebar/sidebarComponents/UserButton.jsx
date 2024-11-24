import React from "react";
import { Settings } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function UserButton() {
  const { t } = useTranslation();
  return (
    <div className="">
      <a
        href={"/profile"}
        className="flex items-center rounded-md p-2 text-gray-200"
      >
        <span className="text-2xl font-semibold">{t("User")}</span>
      </a>
    </div>
  );
}
