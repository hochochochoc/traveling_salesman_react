import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../sidebar/Sidebar";
import { doSignOut } from "../../../../firebase/auth";
import { useAuth } from "../../../../auth/authContext";

export default function Header() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [borderAnimation, setBorderAnimation] = useState(false);
  const { userLoggedIn } = useAuth();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setBorderAnimation(true);
    }, 700);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <div className="flex w-full items-center justify-between border-b border-black px-4 py-4">
        <div onClick={() => navigate("/")} className="text-lg font-extrabold">
          TSP Explorer
        </div>

        <div className="flex items-center">
          {userLoggedIn ? (
            <button
              onClick={() => {
                doSignOut().then(() => {
                  navigate("/menu");
                });
              }}
              className={`relative my-1 mr-8 flex max-h-9 justify-center px-1 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:bg-landing2 before:transition-all before:duration-500 before:ease-out hover:bg-gray-200 active:scale-95 ${
                borderAnimation ? "before:w-full" : "before:w-0"
              }`}
            >
              Log out
            </button>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
              }}
              className={`relative my-1 mr-8 flex max-h-9 justify-center px-1 before:absolute before:bottom-0 before:left-0 before:h-[2px] before:bg-landing2 before:transition-all before:duration-500 before:ease-out hover:bg-gray-200 active:scale-95 ${
                borderAnimation ? "before:w-full" : "before:w-0"
              }`}
            >
              Log in
            </button>
          )}

          <Menu
            className="cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
      </div>
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
    </>
  );
}
