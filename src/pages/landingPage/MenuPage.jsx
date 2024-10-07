import React from "react";
import Sidebar from "./components/sidebar/Sidebar";
import Header from "./components/header/Header";
import Algorithms from "./components/algorithms/Algorithms";
import Maps from "./components/maps/Maps";
import Demos from "./components/demos/Demos";
import Results from "./components/results/Results";
import Description from "./components/description/Description";

export default function MenuPage() {
  return (
    <div className="flex">
      <div className="w-5/6 bg-primary px-4">
        <div className="grid grid-cols-2 p-4">
          <Header />
        </div>
        <div className="flex">
          <div className="m-4 w-1/2">
            <Description />
            <Algorithms />
          </div>
          <div className="m-4 w-1/2">
            <Maps />
            <div className="flex">
              <div className="w-1/2">
                <Demos />
              </div>
              <div className="w-1/2">
                <Results />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
