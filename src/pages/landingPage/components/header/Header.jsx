import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Sidebar from "../sidebar/Sidebar";
import { doSignOut } from "../../../../firebase/auth";
import { useAuth } from "../../../../auth/authContext";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import LanguageOption from "./languageOption/LanguageOption";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [borderAnimation, setBorderAnimation] = useState(false);
  const { userLoggedIn } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBorderAnimation(true);
    }, 700);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className="flex w-full items-center justify-between px-4 py-4">
        <div
          onClick={() => navigate("/")}
          className="text-lg font-extrabold text-white md:text-2xl"
        >
          TSP Explorer
        </div>

        <div className="ml-auto hidden space-x-3 text-white md:flex md:text-lg">
          <button
            className={` ${location.pathname === "/tutorial" ? "font-semibold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : ""}`}
            onClick={() => {
              navigate("/tutorial");
            }}
          >
            Tutorial
          </button>
          <button
            className={`${location.pathname === "/menu" ? "font-semibold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : ""}`}
            onClick={() => {
              navigate("/menu");
            }}
          >
            {t("countries")}
          </button>
          <button
            className={`${location.pathname === "/demos" ? "font-semibold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : ""}`}
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
            {t("algorithms")}
          </button>
          <button
            className={`${location.pathname === "/profile" ? "font-semibold drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" : ""}`}
            onClick={() => {
              navigate("/profile");
            }}
          >
            {t("profile")}
          </button>
          <div className="px-4">
            <LanguageOption />
          </div>
        </div>

        <div className="flex items-center md:text-lg">
          {userLoggedIn ? (
            <button
              onClick={() => {
                doSignOut().then(() => {
                  navigate("/menu");
                });
              }}
              className={`relative my-1 mr-8 flex max-h-9 justify-center px-1 text-white before:absolute before:bottom-0 before:left-0 before:h-[2px] before:bg-blue-200 before:transition-all before:duration-500 before:ease-out hover:bg-gray-200 active:scale-95 ${
                borderAnimation ? "before:w-full" : "before:w-0"
              }`}
            >
              {t("Log_out")}
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
              }}
              className={`relative my-1 mr-8 flex max-h-9 justify-center px-1 text-white before:absolute before:bottom-0 before:left-0 before:h-[2px] before:bg-blue-300 before:transition-all before:duration-500 before:ease-out hover:bg-gray-200 active:scale-95 ${
                borderAnimation ? "before:w-full" : "before:w-0"
              }`}
            >
              {t("Log_in")}
            </button>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "Close menu" : "Open menu"}
            className="relative h-6 w-6 text-white"
          >
            <Menu
              className={`absolute !h-7 !w-7 transition-all ${
                sidebarOpen
                  ? "rotate-90 scale-0 opacity-0"
                  : "rotate-0 scale-100 opacity-100"
              }`}
            />
            <X
              className={`absolute !h-7 !w-7 transition-all ${
                sidebarOpen
                  ? "rotate-0 scale-100 opacity-100"
                  : "-rotate-90 scale-0 opacity-0"
              }`}
            />
          </Button>
        </div>
      </div>
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
    </>
  );
}
