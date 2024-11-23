import React, { createContext, useContext, useState, useEffect } from "react";
import Graph from "../components/graphs/Graph";
import { primsMST } from "../functions/primsMST";
import { kruskalsMST } from "../functions/kruskalsMST";
import { cheapestInsertionTSP } from "../functions/greedyTSP";
import { nearestNeighborTSP } from "../functions/nearestTSP";
import { twoOptTSP } from "../functions/twoOptTSP";
import { christofidesTSP } from "../functions/christofidesTSP";

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload(); // Forces a full reload
  });
}

// Function to calculate distance between two points
const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

const DemosContext = createContext();

const DemosProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState("validation");
  const [algorithmSelection, setAlgorithmSelection] = useState("Nearest");
  const [validationSelection, setValidationSelection] = useState("Prims");
  const [intro, setIntro] = useState(1);

  const value = {
    activeSection,
    setActiveSection,
    algorithmSelection,
    setAlgorithmSelection,
    validationSelection,
    setValidationSelection,
    primsMST: (graph) => primsMST(graph, distance),
    kruskalsMST: (graph) => kruskalsMST(graph, distance),
    nearestNeighborTSP: (graph) => nearestNeighborTSP(graph, distance),
    christofidesTSP: (graph) => christofidesTSP(graph, distance),
    cheapestInsertionTSP: (graph) => cheapestInsertionTSP(graph, distance),
    twoOptTSP: (graph) => twoOptTSP(graph, distance),
    intro,
    setIntro,
  };

  return (
    <DemosContext.Provider value={value}>{children}</DemosContext.Provider>
  );
};

export { DemosProvider, DemosContext };
