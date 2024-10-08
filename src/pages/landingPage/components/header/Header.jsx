import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../sidebar/Sidebar";

export default function Header() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="flex w-full items-center justify-between p-4">
        <div className="text-lg font-extrabold">Algorithm Visualizer</div>
        <div className="flex items-center">
          <Menu
            className="mr-4 cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
          <button
            onClick={() => {
              doSignOut().then(() => {
                navigate("/");
              });
            }}
            className="flex max-h-9 w-24 justify-center rounded-lg border border-black py-1 hover:bg-gray-200 active:scale-95"
          >
            Logout
          </button>
        </div>
      </div>
      {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
    </>
  );
}
