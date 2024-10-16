import React, { useContext, useEffect, useRef } from "react";
import Graph from "./components/graphs/Graph";
import Header from "./components/header/Header";
import { useLocation } from "react-router-dom";
import { DemosContext } from "./context/GraphContext";

export default function DemosPage() {
  const {
    activeSection,
    setActiveSection,
    algorithmSelection,
    setAlgorithmSelection,
    validationSelection,
    setValidationSelection,
  } = useContext(DemosContext);

  const location = useLocation();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (location.state) {
      setActiveSection(location.state.activeSection);
      setAlgorithmSelection(location.state.algorithmSelection);
      setValidationSelection(location.state.validationSelection);
    }
  }, [
    location.state,
    setActiveSection,
    setAlgorithmSelection,
    setValidationSelection,
  ]);

  const algorithmItems = ["Nearest", "Greedy", "TwoOpt", "Christofides"];
  const validationItems = ["Prims", "Kruskals"];

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [activeSection]);

  const renderOptions = (items, activeItem, setActiveItem) => (
    <div
      ref={scrollContainerRef}
      className="hide-scrollbar mt-2 flex overflow-x-auto md:overflow-x-scroll"
      style={{
        scrollSnapType: "x mandatory",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        overflow: "auto",
      }}
    >
      {items.map((item) => (
        <button
          key={item}
          className={`mx-2 flex flex-shrink-0 flex-col items-center justify-center p-3 text-xs font-medium transition-all duration-300 ${
            activeItem === item
              ? "bg-gradient-to-br from-teal-400 to-blue-500 text-white shadow-lg"
              : "bg-gray-900 text-teal-300 hover:bg-gray-700 hover:text-white"
          }`}
          onClick={() => setActiveItem(item)}
          style={{
            scrollSnapAlign: "center",
            minWidth: "100px",
            height: "100px",
          }}
        >
          <div
            className={`mb-2 rounded-full p-2 ${
              activeItem === item ? "bg-white bg-opacity-30" : "bg-gray-700"
            }`}
          >
            <img
              src={`/icon_${item.toLowerCase()}.png`}
              alt={`${item} icon`}
              className="h-10 w-10"
            />
          </div>
          <span className="text-center">{item}</span>
        </button>
      ))}
    </div>
  );

  return (
    <div className="h-screen overflow-hidden bg-landing2">
      <div className="flex flex-row justify-between p-4">
        <Header />
      </div>

      <div className="mx-auto flex max-w-sm flex-col justify-center bg-gray-900 p-2 shadow-lg backdrop-blur-lg backdrop-filter">
        <div className="flex justify-center gap-6">
          <button
            className={`text-sm font-medium transition-all duration-200 ${
              activeSection === "algorithms"
                ? "font-bold text-egg"
                : "text-teal-600 hover:text-teal-500"
            }`}
            onClick={() => setActiveSection("algorithms")}
          >
            Algorithms
          </button>
          <button
            className={`text-sm font-medium transition-all duration-200 ${
              activeSection === "validation"
                ? "font-bold text-egg"
                : "text-teal-600 hover:text-teal-500"
            }`}
            onClick={() => setActiveSection("validation")}
          >
            Validation
          </button>
        </div>

        {activeSection === "algorithms" &&
          renderOptions(
            algorithmItems,
            algorithmSelection,
            setAlgorithmSelection,
          )}
        {activeSection === "validation" &&
          renderOptions(
            validationItems,
            validationSelection,
            setValidationSelection,
          )}
      </div>

      <div className="mt-4">
        {activeSection === "algorithms" && <Graph />}
        {activeSection === "validation" && <Graph />}
      </div>
    </div>
  );
}
