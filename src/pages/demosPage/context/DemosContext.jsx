import React, { createContext, useContext, useState, useEffect } from "react";
import Graph from "../components/graphs/Graph";
import blossom from "edmonds-blossom";

if (import.meta.hot) {
  import.meta.hot.accept(() => {
    window.location.reload(); // Forces a full reload
  });
}

// Function to calculate distance between two points
const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
};

// Function for Christofides Algorithm
const christofidesTSP = (graph) => {
  const n = graph.length;

  // Compute minimum spanning tree
  const mst = computeMST(graph);

  // Find odd-degree vertices
  const oddVertices = findOddDegreeVertices(mst);

  // Compute minimum-weight perfect matching on odd-degree vertices using Blossom algorithm
  const matching = minimumWeightPerfectMatching(oddVertices, graph);

  // Combine MST and matching to form a multigraph
  const multigraph = [...mst, ...matching];

  // Compute Eulerian circuit
  const eulerianCircuit = computeEulerianCircuit(multigraph);

  // Form a Hamiltonian circuit by skipping repeated vertices
  const hamiltonianCircuit = [];
  const visited = new Set();

  for (const vertex of eulerianCircuit) {
    if (!visited.has(vertex)) {
      hamiltonianCircuit.push(vertex);
      visited.add(vertex);
    }
  }

  // Convert Hamiltonian circuit to edges
  const edges = [];
  for (let i = 0; i < hamiltonianCircuit.length; i++) {
    const from = hamiltonianCircuit[i];
    const to = hamiltonianCircuit[(i + 1) % hamiltonianCircuit.length];
    edges.push([from, to]);
  }

  return edges;
};

// Helper function to compute Minimum Spanning Tree using Kruskal's algorithm
const computeMST = (graph) => {
  const n = graph.length;
  const edges = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      edges.push({ from: i, to: j, weight: distance(graph[i], graph[j]) });
    }
  }

  edges.sort((a, b) => a.weight - b.weight);

  const parent = Array.from({ length: n }, (_, i) => i);
  const find = (x) => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (x, y) => {
    parent[find(x)] = find(y);
  };

  const mst = [];
  for (const { from, to } of edges) {
    if (find(from) !== find(to)) {
      mst.push([from, to]);
      union(from, to);
    }
    if (mst.length === n - 1) break;
  }

  return mst;
};

// Helper function to find odd-degree vertices
const findOddDegreeVertices = (mst, graph) => {
  const degree = new Array(graph.length).fill(0);
  for (const [from, to] of mst) {
    degree[from]++;
    degree[to]++;
  }
  return degree.reduce((acc, d, i) => (d % 2 === 1 ? [...acc, i] : acc), []);
};

// Proper minimum-weight perfect matching using Blossom algorithm
const minimumWeightPerfectMatching = (vertices, graph) => {
  const n = vertices.length;
  const edges = [];

  // Create edge list with distances
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      edges.push({
        from: vertices[i],
        to: vertices[j],
        weight: distance(graph[vertices[i]], graph[vertices[j]]),
      });
    }
  }

  // Use the Blossom algorithm to get minimum weight perfect matching
  return blossomAlgorithm(edges, vertices);
};

// Helper function for Blossom algorithm using edmonds-blossom
const blossomAlgorithm = (edges, vertices) => {
  // Convert edges into the format required by edmonds-blossom
  const formattedEdges = edges.map(({ from, to, weight }) => [
    from,
    to,
    weight,
  ]);

  // Use the edmonds-blossom function to find the minimum weight perfect matching
  const result = blossom(formattedEdges);

  // Convert the result back into a readable format
  const matching = [];
  for (let i = 0; i < result.length; i++) {
    if (result[i] !== -1 && i < result[i]) {
      matching.push([i, result[i]]);
    }
  }

  return matching;
};

// Helper function to compute Eulerian circuit
const computeEulerianCircuit = (multigraph) => {
  const adjacencyList = {};
  for (const [from, to] of multigraph) {
    if (!adjacencyList[from]) adjacencyList[from] = [];
    if (!adjacencyList[to]) adjacencyList[to] = [];
    adjacencyList[from].push(to);
    adjacencyList[to].push(from);
  }

  const circuit = [];
  const stack = [Object.keys(adjacencyList)[0]];

  while (stack.length > 0) {
    const v = stack[stack.length - 1];
    if (adjacencyList[v].length === 0) {
      circuit.push(parseInt(v));
      stack.pop();
    } else {
      const u = adjacencyList[v].pop();
      adjacencyList[u] = adjacencyList[u].filter((x) => x !== v);
      stack.push(u);
    }
  }

  return circuit.reverse();
};

// Function for greedy algorithm
const cheapestInsertionTSP = (graph) => {
  const n = graph.length;
  const edges = [];
  const edgeCount = new Array(n).fill(0);

  // Create a list of all possible edges
  const allEdges = [];
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      allEdges.push({
        from: i,
        to: j,
        distance: distance(graph[i], graph[j]),
      });
    }
  }

  // Sort edges by distance (shortest first)
  allEdges.sort((a, b) => a.distance - b.distance);

  // Function to check if adding an edge creates a loop
  const createsLoop = (edge) => {
    if (edges.length < 2) return false;

    const visited = new Set();
    const stack = [edge.from];

    while (stack.length > 0) {
      const node = stack.pop();
      if (node === edge.to) return true;

      if (!visited.has(node)) {
        visited.add(node);
        for (const [a, b] of edges) {
          if (a === node) stack.push(b);
          if (b === node) stack.push(a);
        }
      }
    }

    return false;
  };

  // Greedy edge selection
  for (const edge of allEdges) {
    if (
      edgeCount[edge.from] < 2 &&
      edgeCount[edge.to] < 2 &&
      !createsLoop(edge)
    ) {
      edges.push([edge.from, edge.to]);
      edgeCount[edge.from]++;
      edgeCount[edge.to]++;
    }

    // Check if we have a complete tour
    if (edges.length === n) break;
  }

  // If we don't have a complete tour, try to close it
  if (edges.length < n) {
    const unconnected = edgeCount
      .map((count, index) => (count < 2 ? index : -1))
      .filter((index) => index !== -1);
    if (unconnected.length === 2) {
      edges.push(unconnected);
    }
  }

  return edges;
};

// Nearest Neighbor TSP implementation
const nearestNeighborTSP = (graph) => {
  console.log("chose nearest neighbor");
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
        console.log(algorithmSelection);
        return <Graph />;
      case "Nearest":
        return <Graph />;
      case "Christofides":
        return <Graph />;
      default:
        return null;
    }
  };

  const getParagraphs = () => {
    if (activeSection === "validation") {
      console.log("active section is validation");
      return paragraphs[validationSelection];
    }
    if (activeSection === "algorithms") {
      console.log("active section is algorithm");
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
    Nearest: [
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
    christofidesTSP,
    cheapestInsertionTSP,
  };

  return (
    <DemosContext.Provider value={value}>{children}</DemosContext.Provider>
  );
};

export { DemosProvider, DemosContext };
