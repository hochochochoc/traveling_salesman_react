import React, { useEffect } from "react";
import PrimsGraph from "./components/graphs/PrimsGraph";
import Header from "./components/header/Header";
import OneTreeGraph from "./components/graphs/OneTreeGraph";
import { useSidebar } from "../../context/SidebarContext";
import SidebarLayout from "../landingPage/components/sidebar/SidebarLayout";
import { useNavigate } from "react-router-dom";

export default function DemosPage() {
  const navigate = useNavigate();

  const { toggleSidebarFunctionality } = useSidebar();

  useEffect(() => {
    toggleSidebarFunctionality();
    return () => toggleSidebarFunctionality();
  }, [toggleSidebarFunctionality]);

  return (
    <SidebarLayout>
      <div className="bg-bluedarkest">
        <div className="grid grid-cols-2 p-4">
          <Header />
        </div>

        <div>
          <OneTreeGraph />
          <PrimsGraph />
        </div>
        <div>
          <button
            className="text-egg"
            onClick={() => {
              navigate("/");
            }}
          >
            back to menu
          </button>
        </div>
      </div>
    </SidebarLayout>
  );
}
