import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Header() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center">
        <button
          onClick={() => {
            navigate("/menu");
          }}
        >
          <ArrowLeft className="text-white" />
        </button>
      </div>
      <div className="flex items-center text-lg font-extrabold text-white">
        {t("how_it_works")}
      </div>
      <div></div>
    </>
  );
}
