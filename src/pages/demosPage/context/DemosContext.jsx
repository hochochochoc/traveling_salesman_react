import React, { createContext, useContext, useState, useEffect } from "react";
import Greedy from "../components/graphs/Greedy";
import NearestN from "../components/graphs/NearestN";
import Christofides from "../components/graphs/Christofides";
import Graph from "../components/graphs/Graph";

// Function to calculate distance between two points
const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

// Nearest Neighbor TSP implementation
const nearestNeighborTSP = (graph) => {
  const n = graph.length;
  const visited = new Set();
  const tour = [];
  let currentNode = Math.floor(Math.random() * n); // Start with the first node

  visited.add(currentNode);
  tour.push(currentNode);

  while (visited.size < n) {
    let nearestNode = null;
    let nearestDistance = Infinity;

    // Find the nearest unvisited neighbor
    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        const dist = distance(graph[currentNode], graph[i]);
        if (dist < nearestDistance) {
          nearestNode = i;
          nearestDistance = dist;
        }
      }
    }

    // If a nearest node is found, visit it
    if (nearestNode !== null) {
      visited.add(nearestNode);
      tour.push(nearestNode);
      currentNode = nearestNode;
    }
  }

  // Return to the starting point to complete the cycle
  tour.push(tour[0]);

  // Convert the tour to edge format
  const edges = [];
  for (let i = 0; i < tour.length - 1; i++) {
    edges.push([tour[i], tour[i + 1]]);
  }

  return edges;
};

// Prim's algorithm implementation
const primsMST = (graph) => {
  const n = graph.length;
  const mst = [];
  const visited = new Set();
  let edges = [];

  // Function to add edges between a visited node and unvisited nodes
  const addEdges = (nodeIndex) => {
    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        edges.push({
          from: nodeIndex,
          to: i,
          weight: distance(graph[nodeIndex], graph[i]),
        });
      }
    }
  };

  // Start with a random vertex
  const startVertex = Math.floor(Math.random() * n);
  visited.add(startVertex);
  addEdges(startVertex);

  while (visited.size < n) {
    let minEdge = edges.reduce(
      (min, edge) =>
        !visited.has(edge.to) && edge.weight < min.weight ? edge : min,
      { weight: Infinity },
    );

    if (minEdge.weight === Infinity) {
      // If no valid edge found, exit (disconnected graph)
      break;
    }

    visited.add(minEdge.to);
    mst.push([minEdge.from, minEdge.to]);

    addEdges(minEdge.to);
    edges = edges.filter((edge) => !visited.has(edge.to));
  }

  return mst;
};

// Kruskal's algorithm implementation
const kruskalsMST = (graph) => {
  const edges = [];
  const n = graph.length;

  // Create all edges with their weights
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      edges.push({
        from: i,
        to: j,
        weight: distance(graph[i], graph[j]),
      });
    }
  }

  // Sort edges based on weight
  edges.sort((a, b) => a.weight - b.weight);

  const mst = [];
  const parent = Array(n).fill(-1); // -1 indicates that a node is its own parent

  // Helper functions for Union-Find
  const find = (parent, i) => {
    if (parent[i] === -1) return i;
    return find(parent, parent[i]);
  };

  const union = (parent, x, y) => {
    parent[x] = y;
  };

  // Iterate over edges and build the MST
  for (let edge of edges) {
    const { from, to } = edge;

    const rootFrom = find(parent, from);
    const rootTo = find(parent, to);

    // If they belong to different sets, include this edge in the MST
    if (rootFrom !== rootTo) {
      mst.push([from, to]);
      union(parent, rootFrom, rootTo); // Union the sets
    }
  }

  return mst;
};

const DemosContext = createContext();

const DemosProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState("validation");
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

  const renderAlgorithm = () => {
    switch (algorithmSelection) {
      case "Greedy":
        return <Greedy />;
      case "Nearest":
        console.log("rendered Nearest");
        return <Graph />;
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

  // Paragraphs data
  const paragraphs = {
    Prims: [
      {
        id: 0,
        text: "Just some example text for Prim's algorithm.",
        // text: "How do we measure how good a solution from an algorithm is? ... The MST is defined as a collection of edges of a graph that connect all vertices, introduce no cycles or loops and also has minimum weight(cost/distance). This is a similar problem to the TSP, but finding the MST has several polynomial time algorithms. One efficient algorithm for finding the MST is called Prim's algorithm.",
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
        text: "Kruskal. This is the other validation algorithm, Kruskal's algorithm.",
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
    primsMST,
    kruskalsMST,
    nearestNeighborTSP,
  };

  return (
    <DemosContext.Provider value={value}>{children}</DemosContext.Provider>
  );
};

export { DemosProvider, DemosContext };
