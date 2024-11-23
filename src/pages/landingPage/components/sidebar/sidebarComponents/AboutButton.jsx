import React from "react";
import { useTranslation } from "react-i18next";

const AboutButton = () => {
  const { t } = useTranslation();
  return (
    <a href={"/about"} className="flex items-center p-2 text-gray-200">
      <span className="text-2xl font-semibold">{t("About")}</span>
    </a>
  );
};

export default AboutButton;
