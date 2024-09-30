import React, { createContext, useContext, useState, useEffect } from "react";

import Greedy from "../components/graphs/Greedy";
import NearestN from "../components/graphs/NearestN";
import Christofides from "../components/graphs/Christofides";

const DemosContext = createContext();

const DemosProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState("algorithms");
  const [algorithmSelection, setAlgorithmSelection] = useState("Greedy");
  const [validationSelection, setValidationSelection] = useState("Prims");

  // Initial graph data
  const initialGraphData = [
    { id: 0, x: 150, y: 110 },
    { id: 1, x: 510, y: 230 },
    { id: 2, x: 200, y: 100 },
    { id: 3, x: 440, y: 340 },
    { id: 4, x: 560, y: 100 },
    { id: 5, x: 350, y: 140 },
    { id: 6, x: 50, y: 250 },
    { id: 7, x: 550, y: 50 },
    { id: 8, x: 70, y: 150 },
  ];

  // Paragraphs data
  const paragraphs = {
    Prims: [
      {
        id: 0,
        text: "How do we measure how good a solution from an algorithm is? ... The MST is defined as a collection of edges of a graph that connect all vertices, introduce no cycles or loops and also has minimum weight(cost/distance). This is a similar problem to the TSP, but finding the MST has several polynomial time algorithms. One efficient algorithm for finding the MST is called Prim's algorithm.",
      },
      {
        id: 1,
        text: "We start with a random vertex and at every step it considers the set of vertices as part of the tree and a set of vertices we've yet to encounter.",
      },
      {
        id: 2,
        text: "To determine the best edge to pick as first part of the tree, we simply take the minimum edge weight between these two sets.",
      },
      {
        id: 3,
        text: "Every time we add an edge we adjust the sets, moving the subsequent vertex accordingly.",
      },
      {
        id: 4,
        text: "By repeatedly applying this step until all vertices have been processed you are guaranteed to find the Minimum Spanning Tree.",
      },
      {
        id: 5,
        text: "Prim's Algorithm is a classic example of a greedy approach that provides the optimal solution, and an interesting result is that the MST is always a lower bound for the TSP.",
      },
      {
        id: 6,
        text: '- then he starts talking about the "1-Tree"',
      },
      { id: 7, text: "lo que sea7" },
      { id: 8, text: "lo que sea8" },
    ],
    Kruskals: [
      {
        id: 0,
        text: "Kruskaaaaal...! This is the other algorithm, Kruskal's algorithm.",
      },
      {
        id: 1,
        text: "We start with a random vertex and at every step it considers the set of vertices as part of the tree and a set of vertices we've yet to encounter.",
      },
      {
        id: 2,
        text: "Example 2",
      },
      {
        id: 3,
        text: "Example 3",
      },
      {
        id: 4,
        text: "Example 4",
      },
      {
        id: 5,
        text: "Example 5",
      },
      {
        id: 6,
        text: "Example 6",
      },
      { id: 7, text: "lo que sea7" },
      { id: 8, text: "lo que sea8" },
    ],
    Greedy: [
      {
        id: 0,
        text: "Greedy example text.",
      },
      {
        id: 1,
        text: "We start with a random vertex and at every step it considers the set of vertices as part of the tree and a set of vertices we've yet to encounter.",
      },
      {
        id: 2,
        text: "Example 2",
      },
      {
        id: 3,
        text: "Example 3",
      },
      {
        id: 4,
        text: "Example 4",
      },
      {
        id: 5,
        text: "Example 5",
      },
      {
        id: 6,
        text: "Example 6",
      },
      { id: 7, text: "lo que sea7" },
      { id: 8, text: "lo que sea8" },
    ],
    NearestN: [
      {
        id: 0,
        text: "Nearest neighbor example text.",
      },
      {
        id: 1,
        text: "Example 1",
      },
      {
        id: 2,
        text: "Example 2",
      },
      {
        id: 3,
        text: "Example 3",
      },
      {
        id: 4,
        text: "Example 4",
      },
      {
        id: 5,
        text: "Example 5",
      },
      {
        id: 6,
        text: "Example 6",
      },
      { id: 7, text: "lo que sea7" },
      { id: 8, text: "lo que sea8" },
    ],
    Christofides: [
      {
        id: 0,
        text: "Christofides example text.",
      },
      {
        id: 1,
        text: "Example 1",
      },
      {
        id: 2,
        text: "Example 2",
      },
      {
        id: 3,
        text: "Example 3",
      },
      {
        id: 4,
        text: "Example 4",
      },
      {
        id: 5,
        text: "Example 5",
      },
      {
        id: 6,
        text: "Example 6",
      },
      { id: 7, text: "lo que sea7" },
      { id: 8, text: "lo que sea8" },
    ],
  };

  const renderAlgorithm = () => {
    switch (algorithmSelection) {
      case "Greedy":
        return <Greedy />;
      case "Nearest":
        return <NearestN />;
      case "Christofides":
        return <Christofides />;
      default:
        return null;
    }
  };

  const getParagraphs = () => {
    if (activeSection === "validation") {
      return paragraphs[validationSelection];
    }
    if (activeSection === "algorithm") {
      return paragraphs[algorithmSelection];
    }
    return [];
  };

  const value = {
    activeSection,
    setActiveSection,
    algorithmSelection,
    setAlgorithmSelection,
    validationSelection,
    setValidationSelection,
    renderAlgorithm,
    initialGraphData,
    getParagraphs,
  };

  return (
    <DemosContext.Provider value={value}>{children}</DemosContext.Provider>
  );
};

export { DemosProvider, DemosContext };
