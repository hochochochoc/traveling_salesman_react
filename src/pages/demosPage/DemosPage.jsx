import React, { useState } from "react";
import PrimsGraph from "./components/graphs/PrimsGraph";
import KruskalsGraph from "./components/graphs/KruskalsGraph";
import Greedy from "./components/graphs/Greedy";
import NearestN from "./components/graphs/NearestN";
import Christofides from "./components/graphs/Christofides";
import Header from "./components/header/Header";
import { useNavigate } from "react-router-dom";

export default function DemosPage() {
  const [showPrimsGraph, setShowPrimsGraph] = useState(true);
  const [activeSection, setActiveSection] = useState("algorithms");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("Greedy");
  const navigate = useNavigate();

  const renderAlgorithm = () => {
    switch (selectedAlgorithm) {
      case "Greedy":
        return <Greedy />;
      case "Nearest ":
        return <NearestN />;
      case "Christofides":
        return <Christofides />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="bg-bluedarkest">
        <div className="grid grid-cols-2 p-4">
          <Header />
        </div>

        <div className="mx-auto mb-4 flex max-w-max flex-col justify-center gap-2 rounded-xl bg-gray-800 p-2 shadow-lg backdrop-blur-lg backdrop-filter">
          <div className="flex justify-center gap-2">
            <button
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
                activeSection === "algorithms"
                  ? "bg-quaternary text-egg shadow-md hover:bg-quinary"
                  : "bg-gray-700 text-teal-300 hover:bg-teal-500 hover:bg-opacity-20"
              }`}
              onClick={() => setActiveSection("algorithms")}
            >
              Algorithms
            </button>
            <button
              className={`rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
                activeSection === "validation"
                  ? "bg-quaternary text-egg shadow-md hover:bg-quinary"
                  : "bg-gray-700 text-teal-300 hover:bg-teal-500 hover:bg-opacity-20"
              }`}
              onClick={() => setActiveSection("validation")}
            >
              Validation
            </button>
          </div>

          {activeSection === "algorithms" && (
            <div className="flex gap-2">
              {["Greedy", "Nearest ", "Christofides"].map((algo) => (
                <button
                  className={`rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
                    selectedAlgorithm === algo
                      ? "bg-quaternary text-egg shadow-md hover:bg-quinary"
                      : "bg-gray-700 text-teal-300 hover:bg-teal-500 hover:bg-opacity-20"
                  }`}
                  key={algo}
                  onClick={() => setSelectedAlgorithm(algo)}
                >
                  {algo}
                </button>
              ))}
            </div>
          )}

          {activeSection === "validation" && (
            <div className="flex gap-2">
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
                Kruskal's Algorithm
              </button>
            </div>
          )}
        </div>

        <div>
          {activeSection === "algorithms" && renderAlgorithm()}
          {activeSection === "validation" &&
            (showPrimsGraph ? <PrimsGraph /> : <KruskalsGraph />)}
        </div>

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
