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
    <div className="flex w-auto flex-col bg-primary">
      <div className="flex flex-row justify-center space-x-10 p-4">
        <Header />
      </div>
      <div className="mx-3 mb-3 flex flex-col space-y-3">
        {/* <Description /> */}
        <Demos />

        <Maps />

        <Algorithms />

        <Results />
      </div>
    </div>
  );
}
