import React, { useState, useEffect } from "react";
import PrimsGraph from "./components/graphs/PrimsGraph";
import Header from "./components/header/Header";
import OneTreeGraph from "./components/graphs/OneTreeGraph";
import { useNavigate } from "react-router-dom";

export default function DemosPage() {
  const [showPrimsGraph, setShowPrimsGraph] = useState(true);
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-bluedarkest">
        <div className="grid grid-cols-2 p-4">
          <Header />
        </div>

        <div className="mx-auto mb-4 flex max-w-max justify-center gap-2 rounded-xl bg-gray-800 p-2 shadow-lg backdrop-blur-lg backdrop-filter">
          <button
            className={`rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
              showPrimsGraph
                ? "bg-quaternary text-egg shadow-md hover:bg-quinary"
                : "bg-gray-700 text-teal-300 hover:bg-teal-500 hover:bg-opacity-20"
            }`}
            onClick={() => setShowPrimsGraph(true)}
          >
            Prim's Algorithm
          </button>
          <button
            className={`rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
              !showPrimsGraph
                ? "bg-quaternary text-egg shadow-md hover:bg-quinary"
                : "bg-gray-700 text-teal-300 hover:bg-teal-500 hover:bg-opacity-20"
            }`}
            onClick={() => setShowPrimsGraph(false)}
          >
            One Tree Graph
          </button>
        </div>

        <div>{showPrimsGraph ? <PrimsGraph /> : <OneTreeGraph />}</div>
        <div>
          <button
            className="mx-4 mb-2 text-egg"
            onClick={() => {
              navigate("/");
            }}
          >
            back to menu
          </button>
        </div>
      </div>
    </>
  );
}
