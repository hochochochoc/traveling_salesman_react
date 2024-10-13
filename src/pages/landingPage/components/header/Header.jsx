import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../sidebar/Sidebar";

export default function Header() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-between border-b border-black px-4 py-4">
        <div className="text-lg font-extrabold">TSP Explorer</div>
        <div className="flex items-center">
          <button
            onClick={() => {
              doSignIn().then(() => {
                navigate("/");
              });
            }}
            className="my-1 mr-8 flex max-h-9 justify-center border-b-2 border-black px-2 hover:bg-gray-200 active:scale-95"
          >
            Logout
          </button>
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
