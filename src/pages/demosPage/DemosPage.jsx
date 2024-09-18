import React from "react";
import Graph from "./components/graphs/PrimsGraph";
import Header from "./components/header/Header";

export default function DemosPage() {
  return (
    <div className="bg-bluedarkest">
      <Header />
      <div>
        <Graph />
      </div>
    </div>
  );
}
