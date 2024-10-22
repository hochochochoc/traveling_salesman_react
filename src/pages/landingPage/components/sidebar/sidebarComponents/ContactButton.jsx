import React from "react";
import { useTranslation } from "react-i18next";

const ContactButton = ({ href = "/contact" }) => {
  const { t } = useTranslation();
  return (
    <a href={href} className="flex items-center rounded-md p-2 text-gray-200">
      <span className="text-2xl font-semibold">{t("Contact")}</span>
    </a>
  );
};

export default ContactButton;
