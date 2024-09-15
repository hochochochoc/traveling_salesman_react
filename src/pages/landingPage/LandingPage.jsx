import React from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import Algorithms from "./components/algorithms/Algorithms";
import Maps from "./components/maps/Maps";
import Demos from "./components/demos/Demos";
import History from "./components/history/History";
import Description from "./components/description/Description";

export default function LandingPage() {
  return (
    <div className="flex">
      <div className="w-1/6">
        <Sidebar />
      </div>
      <div className="bg-primary w-5/6 px-4">
        <div className="grid grid-cols-2 p-4">
          <Header />
        </div>
        <div className="flex">
          <div className="w-1/2 m-4">
            <Description />
            <Algorithms />
          </div>
          <div className="w-1/2 m-4">
            <Maps />
            <div className="flex">
              <div className="w-1/2">
                <Demos />
              </div>
              <div className="w-1/2">
                <History />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
