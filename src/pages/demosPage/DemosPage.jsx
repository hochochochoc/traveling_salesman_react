import React, { useContext, useEffect, useRef, useState } from "react";
import Graph from "./components/graphs/Graph";
import Header from "../landingPage/components/header/Header";
import { useLocation } from "react-router-dom";
import { DemosContext } from "./context/GraphContext";
import RenderOptions from "./components/options/RenderOptions";
import Intro from "./components/intro/Intro";
import MobileMenu from "../components/Menu";
import { useTranslation } from "react-i18next";

export default function DemosPage() {
  const {
    activeSection,
    setActiveSection,
    algorithmSelection,
    setAlgorithmSelection,
    validationSelection,
    setValidationSelection,
    intro,
    setIntro,
  } = useContext(DemosContext);

  const { t } = useTranslation();

  const location = useLocation();
  const scrollContainerRef = useRef(null);

  const algorithmItems = ["Nearest", "Greedy", "TwoOpt", "Christofides"];
  const validationItems = ["Prims", "Kruskals"];

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

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
  }, [activeSection]);

  return (
    <div className="h-screen overflow-hidden bg-gradient-to-b from-egg to-gray-800">
      <div className="hidden flex-row justify-between md:flex">
        <Header />
      </div>
      {intro === 0 && <Intro />}

      {intro === 1 && (
        <div>
          <div className="mx-auto flex max-w-sm flex-col justify-center p-2 backdrop-blur-lg backdrop-filter md:max-w-3xl">
            <div className="flex justify-center gap-6">
              <button
                className={`text-sm font-medium transition-all duration-200 ${
                  activeSection === "algorithms"
                    ? "font-bold text-white"
                    : "text-teal-600 hover:text-teal-500"
                }`}
                onClick={() => setActiveSection("algorithms")}
              >
                {t("algorithms")}
              </button>
              <button
                className={`text-sm font-medium transition-all duration-200 ${
                  activeSection === "validation"
                    ? "font-bold text-white"
                    : "text-teal-600 hover:text-teal-500"
                }`}
                onClick={() => setActiveSection("validation")}
              >
                {t("validation")}
              </button>
            </div>

            {activeSection === "algorithms" && (
              <RenderOptions
                items={algorithmItems}
                activeItem={algorithmSelection}
                setActiveItem={setAlgorithmSelection}
              />
            )}
            {activeSection === "validation" && (
              <RenderOptions
                items={validationItems}
                activeItem={validationSelection}
                setActiveItem={setValidationSelection}
              />
            )}
          </div>

          <div className="mt-4">
            {activeSection === "algorithms" && <Graph />}
            {activeSection === "validation" && <Graph />}
          </div>
        </div>
      )}
      <div className="md:hidden">
        <MobileMenu />
      </div>
    </div>
  );
}
