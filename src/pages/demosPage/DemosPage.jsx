import React, { useContext } from "react";
import Graph from "./components/graphs/Graph";

import Header from "./components/header/Header";
import { useNavigate } from "react-router-dom";
import { DemosContext } from "./context/demosContext";

export default function DemosPage() {
  const {
    activeSection,
    setActiveSection,
    algorithmSelection,
    setAlgorithmSelection,
    validationSelection,
    setValidationSelection,
    renderAlgorithm,
  } = useContext(DemosContext);
  const navigate = useNavigate();

  return (
    <>
      <div className="bg-bluedarkest">
        <div className="grid grid-cols-2 p-4">
          <Header />
        </div>

        <div className="mx-auto flex max-w-max flex-col justify-center gap-2 rounded-xl bg-gray-800 p-2 shadow-lg backdrop-blur-lg backdrop-filter">
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
              {["Greedy", "Nearest", "Christofides"].map((algo) => (
                <button
                  className={`rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
                    algorithmSelection === algo
                      ? "bg-quaternary text-egg shadow-md hover:bg-quinary"
                      : "bg-gray-700 text-teal-300 hover:bg-teal-500 hover:bg-opacity-20"
                  }`}
                  key={algo}
                  onClick={() => setAlgorithmSelection(algo)}
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
                  validationSelection === "Prims"
                    ? "bg-quaternary text-egg shadow-md hover:bg-quinary"
                    : "bg-gray-700 text-teal-300 hover:bg-teal-500 hover:bg-opacity-20"
                }`}
                onClick={() => setValidationSelection("Prims")}
              >
                Prim's Algorithm
              </button>
              <button
                className={`rounded-lg px-6 py-3 text-sm font-medium transition-all duration-300 ${
                  validationSelection === "Kruskals"
                    ? "bg-quaternary text-egg shadow-md hover:bg-quinary"
                    : "bg-gray-700 text-teal-300 hover:bg-teal-500 hover:bg-opacity-20"
                }`}
                onClick={() => setValidationSelection("Kruskals")}
              >
                Kruskal's Algorithm
              </button>
            </div>
          )}
        </div>

        <div>
          {activeSection === "algorithms" && renderAlgorithm()}
          {activeSection === "validation" && <Graph />}
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
