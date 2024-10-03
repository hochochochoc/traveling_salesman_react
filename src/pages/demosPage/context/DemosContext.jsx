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
  const startTime = performance.now();
  const n = graph.length;

  // Compute minimum spanning tree
  const mst = computeMST(graph);

  // Find odd-degree vertices
  const oddVertices = findOddDegreeVertices(mst, n);

  // Compute minimum-weight perfect matching on odd-degree vertices using Blossom algorithm
  const matching = minimumWeightPerfectMatching(oddVertices, graph);

  // Combine MST and matching to form a multigraph
  const multigraph = [...mst, ...matching];

  // Compute Eulerian circuit
  const eulerianCircuit = computeEulerianCircuit(multigraph, n);

  // Convert Eulerian circuit to Hamiltonian circuit more effectively
  const tour = convertEulerianToHamiltonian(eulerianCircuit);

  // Convert tour to edges
  const edges = [];
  for (let i = 0; i < tour.length; i++) {
    const from = tour[i];
    const to = tour[(i + 1) % tour.length];
    edges.push([from, to]);
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return { edges, executionTime };
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
const findOddDegreeVertices = (mst, n) => {
  const degree = new Array(n).fill(0);
  for (const [from, to] of mst) {
    degree[from]++;
    degree[to]++;
  }
  return degree.reduce((acc, d, i) => (d % 2 === 1 ? [...acc, i] : acc), []);
};

// Minimum-weight perfect matching using Blossom algorithm
const minimumWeightPerfectMatching = (vertices, graph) => {
  const n = vertices.length;
  const edges = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const weight = Math.round(
        distance(graph[vertices[i]], graph[vertices[j]]) * 1000,
      );
      edges.push([vertices[i], vertices[j], weight]); // Include vertices in the edge
    }
  }

  const matching = blossom(edges, true);

  if (!matching) {
    console.error("Matching failed or returned undefined");
    return [];
  }

  return matching.reduce((acc, match, index) => {
    if (match !== -1 && index < match) {
      acc.push([vertices[index], vertices[match]]);
    }
    return acc;
  }, []);
};

// Helper function to compute Eulerian circuit
const computeEulerianCircuit = (multigraph, n) => {
  const adjacencyList = Array.from({ length: n }, () => []);
  for (const [from, to] of multigraph) {
    if (from < n && to < n) {
      adjacencyList[from].push(to);
      adjacencyList[to].push(from);
    } else {
      console.error(`Invalid edge in multigraph: [${from}, ${to}]`);
    }
  }

  const circuit = [];
  const stack = [0];

  while (stack.length > 0) {
    const v = stack[stack.length - 1];
    if (v >= 0 && v < n) {
      // Check if v is valid
      if (adjacencyList[v].length === 0) {
        circuit.push(v);
        stack.pop();
      } else {
        const u = adjacencyList[v].pop();
        adjacencyList[u] = adjacencyList[u].filter((x) => x !== v);
        stack.push(u);
      }
    } else {
      console.error(`Invalid vertex in stack: ${v}`);
      stack.pop(); // Exit the loop to avoid infinite looping
    }
  }

  return circuit.reverse();
};

// New function to convert Eulerian circuit to Hamiltonian circuit more effectively
const convertEulerianToHamiltonian = (eulerianCircuit) => {
  const visited = new Set();
  const tour = [];

  for (const vertex of eulerianCircuit) {
    if (!visited.has(vertex)) {
      tour.push(vertex);
      visited.add(vertex);
    }
  }

  return tour;
};

//
//
// Function for 2-Opt method
const twoOptTSP = (graph, maxIterations = 2000) => {
  const startTime = performance.now();
  console.log("Performing 2-opt optimization");
  const n = graph.length;

  // Create a map of id to node for quick lookup
  const nodeMap = new Map(graph.map((node) => [node.id, node]));

  // Calculate the distance between two points
  const distance = (a, b) => {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  };

  // Calculate the total distance of the tour
  const calculateTourDistance = (tour) => {
    let totalDistance = 0;
    for (let i = 0; i < tour.length; i++) {
      const nodeA = nodeMap.get(tour[i][0]);
      const nodeB = nodeMap.get(tour[(i + 1) % tour.length][0]); // Wrap around

      if (!nodeA || !nodeB) {
        return Infinity; // Invalid nodes
      }

      totalDistance += distance(nodeA, nodeB);
    }
    return totalDistance;
  };

  // Swap two edges in the tour
  const twoOptSwap = (tour, i, k) => {
    return [
      ...tour.slice(0, i),
      ...tour.slice(i, k + 1).reverse(),
      ...tour.slice(k + 1),
    ];
  };

  // Generate initial tour using nearest neighbor
  let tour = nearestNeighborTSP(graph);

  // Ensure the tour uses node IDs directly
  if (
    tour.length > 0 &&
    Array.isArray(tour[0]) &&
    typeof tour[0][0] === "number"
  ) {
    tour = tour.map((node) => node[0]); // Extract the first element if it's an array
  }

  let improved = true;

  // Perform 2-opt optimization
  while (improved) {
    improved = false;

    for (let i = 0; i < n - 1; i++) {
      for (let k = i + 1; k < n; k++) {
        // Skip adjacent edges and the last wrap-around edge
        if (k - i === 1 || (i === 0 && k === n - 1)) continue;

        const newTour = twoOptSwap(tour, i, k);
        const currentDistance = calculateTourDistance(tour);
        const newDistance = calculateTourDistance(newTour);

        // If the new tour is shorter, accept the new tour
        if (newDistance < currentDistance) {
          tour = newTour;
          improved = true;
        }
      }
    }
  }

  // Convert the tour to edge format, ensuring it wraps back to the start
  const edges = [];
  for (let i = 0; i < tour.length; i++) {
    edges.push([tour[i], tour[(i + 1) % tour.length]]); // Wrap around
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return { edges, executionTime };
};

// Function for greedy algorithm
const cheapestInsertionTSP = (graph) => {
  const startTime = performance.now();
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

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return { edges, executionTime };
};

// Nearest Neighbor TSP implementation
const nearestNeighborTSP = (graph) => {
  const startTime = performance.now();
  // console.log("chose nearest neighbor");
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

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return { edges, executionTime };
};

// Prim's algorithm implementation
const primsMST = (graph) => {
  const startTime = performance.now();
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

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return { mst, executionTime };
};

// Kruskal's algorithm implementation
const kruskalsMST = (graph) => {
  const startTime = performance.now();
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

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return { mst, executionTime };
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
      case "TwoOpt":
        return <Graph />;
      default:
        return null;
    }
  };

  const getParagraphs = () => {
    if (activeSection === "validation") {
      return paragraphs[validationSelection];
    }
    if (activeSection === "algorithms") {
      return paragraphs[algorithmSelection];
    }
    return [];
  };

  // Paragraphs data
  const paragraphs = {
    Prims: [
      {
        id: 0,
        text: "Prim’s algorithm is a greedy approach to find the minimum spanning tree (MST) of a weighted graph. It's often used to approximate a lower bound for the traveling salesman problem (TSP).",
        // text: "How do we measure how good a solution from an algorithm is? ... The MST is defined as a collection of edges of a graph that connect all vertices, introduce no cycles or loops and also has minimum weight(cost/distance). This is a similar problem to the TSP, but finding the MST has several polynomial time algorithms. One efficient algorithm for finding the MST is called Prim's algorithm.",
      },
      {
        id: 1,
        text: "We start by selecting an arbitrary vertex as the initial point. From this vertex, the algorithm picks the smallest weighted edge connected to any unvisited vertex.",
      },
      {
        id: 2,
        text: "Once the first edge is added, we explore all adjacent vertices. The algorithm picks the smallest available edge that connects to the MST without forming a cycle.",
      },
      {
        id: 3,
        text: "As more vertices are added, Prim’s algorithm continues selecting the smallest edge that links to a new, unvisited vertex, ensuring no cycles are formed.",
      },
      {
        id: 4,
        text: "With each new edge added, the MST grows. The algorithm repeats the process of scanning all possible edges connected to the tree, adding the shortest viable option.",
      },
      {
        id: 5,
        text: "Prim’s algorithm efficiently builds the MST by considering only the smallest edges. This step minimizes the overall weight, helping establish the lower bound for TSP.",
      },
      {
        id: 6,
        text: "The algorithm continues until all vertices are included. Each step involves careful selection of edges to ensure that the total cost is minimized without forming loops.",
      },
      {
        id: 7,
        text: "Once the minimum spanning tree is complete, the total weight represents an approximation for the TSP lower bound, though it doesn't guarantee the shortest possible route.",
      },
      {
        id: 8,
        text: "Prim’s algorithm is valuable for generating the MST and providing an efficient lower bound estimate for TSP. However, further refinement is needed to find the optimal tour.",
      },
    ],
    Kruskals: [
      {
        id: 0,
        text: "Kruskal’s algorithm is a greedy method used to find the minimum spanning tree (MST) of a graph. It helps establish a lower bound for the traveling salesman problem (TSP).",
      },
      {
        id: 1,
        text: "Kruskal’s algorithm begins by sorting all edges in the graph by their weight. The smallest edge is selected first, provided it doesn’t form a cycle with any other edges.",
      },
      {
        id: 2,
        text: "The next smallest edge is chosen, again ensuring no cycles are formed. This step is repeated until all edges have been processed or a spanning tree is formed.",
      },
      {
        id: 3,
        text: "If an edge would create a cycle, it is skipped. Kruskal’s algorithm checks each edge independently, keeping track of connected components to prevent loops.",
      },
      {
        id: 4,
        text: "As edges are added, the connected components gradually merge. The algorithm ensures that the tree grows without forming any unnecessary loops between vertices.",
      },
      {
        id: 5,
        text: "Kruskal’s method avoids recalculating edge weights by relying on its initial sorted list. This efficient selection helps minimize the total weight of the spanning tree.",
      },
      {
        id: 6,
        text: "When all vertices are connected, the minimum spanning tree is complete. This gives an approximate lower bound for the TSP by summing the selected edge weights.",
      },
      {
        id: 7,
        text: "Though the MST provides an estimate for the TSP, it doesn’t guarantee an optimal solution. Further steps are necessary to close the TSP tour from the MST.",
      },
      {
        id: 8,
        text: "Kruskal’s algorithm is effective in finding the MST and offers a lower bound for TSP. However, additional methods are needed to solve the full TSP.",
      },
    ],
    Greedy: [
      {
        id: 0,
        text: "The greedy algorithm for the traveling salesman problem (TSP) builds a solution by repeatedly selecting the shortest available edge, ensuring it eventually forms one valid loop.",
      },
      {
        id: 1,
        text: "The algorithm starts by considering all edges in the graph and selecting the shortest one. This edge connects two vertices, which form the beginning of the tour.",
      },
      {
        id: 2,
        text: "It then looks for the next shortest available edge that connects an unvisited vertex to any already visited vertex, while avoiding cycles that don't connect all vertices.",
      },
      {
        id: 3,
        text: "This process of selecting the smallest edge continues, always ensuring that no subloops are formed and that each new edge leads to a valid partial TSP tour.",
      },
      {
        id: 4,
        text: "As more vertices are added, the greedy approach ensures that no vertex is revisited until all vertices are connected in a way that can be completed into one tour.",
      },
      {
        id: 5,
        text: "The algorithm prioritizes immediate small gains by choosing the shortest edge available, but must be careful not to close loops early, which would prevent the completion of a full tour.",
      },
      {
        id: 6,
        text: "As the number of remaining unvisited vertices decreases, the algorithm must increasingly focus on connecting the remaining vertices without forming invalid sub-tours.",
      },
      {
        id: 7,
        text: "When only two unvisited vertices remain, the algorithm selects the shortest edge connecting one of them to a visited vertex. The final edge completes the tour, forming a valid TSP cycle.",
      },
      {
        id: 8,
        text: "While the greedy approach can be efficient, it tends to overlook global optimization, as it focuses only on immediate edge lengths, which can lead to a suboptimal overall tour.",
      },
      {
        id: 9,
        text: "The greedy algorithm offers a fast and intuitive way to solve the TSP. However, its shortsightedness in edge selection often prevents it from finding the optimal solution.",
      },
    ],
    Nearest: [
      {
        id: 0,
        text: "The nearest neighbor algorithm is a simple heuristic for solving the traveling salesman problem (TSP). It builds a solution by iteratively visiting the closest unvisited vertex.",
      },
      {
        id: 1,
        text: "The algorithm starts by selecting an arbitrary vertex as the starting point. From this initial vertex, it chooses the closest unvisited vertex as the next stop.",
      },
      {
        id: 2,
        text: "After visiting the nearest vertex, the algorithm repeats the process. It looks for the closest unvisited vertex from the current location and moves there.",
      },
      {
        id: 3,
        text: "The process continues, with each step involving selecting the nearest unvisited vertex. This ensures that short edges are prioritized, keeping the path length minimal at each step.",
      },
      {
        id: 4,
        text: "As the tour progresses, the remaining vertices to visit decrease. The nearest neighbor method avoids revisiting already visited vertices, ensuring each one is visited exactly once.",
      },
      {
        id: 5,
        text: "When only one vertex remains, the algorithm moves to that vertex and completes the tour by returning to the starting point, forming a Hamiltonian cycle.",
      },
      {
        id: 6,
        text: "While the nearest neighbor method is efficient, it can sometimes miss the optimal route by focusing too much on short-term gains, leading to suboptimal long-term paths.",
      },
      {
        id: 7,
        text: "The quality of the solution depends on the starting vertex. Running the algorithm from different starting points can yield different results, with varying tour lengths.",
      },
      {
        id: 8,
        text: "Despite its simplicity, the nearest neighbor algorithm is fast and effective for smaller graphs. However, for larger graphs, it may not provide a good approximation of the optimal solution.",
      },
      {
        id: 9,
        text: "The nearest neighbor approach offers a quick and intuitive solution for the TSP. While it’s not always optimal, it's useful in cases where speed is prioritized over accuracy.",
      },
    ],
    Christofides: [
      {
        id: 0,
        text: "Christofides' algorithm is a heuristic for solving the traveling salesman problem (TSP). It guarantees an approximation within 1.5 times the optimal tour length, making it efficient for large graphs.",
      },
      {
        id: 1,
        text: "The algorithm begins by constructing a minimum spanning tree (MST) of the graph using either Prim’s or Kruskal’s algorithm. This tree connects all vertices with the smallest total edge weight.",
      },
      {
        id: 2,
        text: "Next, it identifies the vertices with odd degrees in the MST. These odd-degree vertices will later be matched to form an Eulerian graph, crucial for finding an optimal TSP route.",
      },
      {
        id: 3,
        text: "A minimum-weight perfect matching is computed for the odd-degree vertices. This step adds the smallest possible edges to pair up all odd-degree vertices without creating cycles.",
      },
      {
        id: 4,
        text: "By combining the minimum spanning tree and the perfect matching, an Eulerian multigraph is formed. This means every vertex has an even degree, allowing for an Eulerian circuit.",
      },
      {
        id: 5,
        text: "The Eulerian circuit is then constructed by tracing through the edges of the multigraph. In this circuit, every edge is visited exactly once, ensuring no redundant paths.",
      },
      {
        id: 6,
        text: "The next step involves converting the Eulerian circuit into a Hamiltonian circuit, which requires visiting each vertex exactly once. This is done using a shortcutting technique.",
      },
      {
        id: 7,
        text: "Shortcutting eliminates repeated visits to vertices while preserving the order of the Eulerian circuit. The result is a Hamiltonian cycle, which serves as the solution to the TSP.",
      },
      {
        id: 8,
        text: "The total weight of this Hamiltonian cycle is guaranteed to be within 1.5 times the optimal solution. Christofides' algorithm ensures a good balance between efficiency and accuracy.",
      },
      {
        id: 9,
        text: "Christofides' algorithm offers a practical approach for approximating TSP solutions, with a proven performance ratio. While not always optimal, it's effective for large-scale problems.",
      },
    ],
    TwoOpt: [
      {
        id: 0,
        text: "Christofides' algorithm is a heuristic for solving the traveling salesman problem (TSP). It guarantees an approximation within 1.5 times the optimal tour length, making it efficient for large graphs.",
      },
      {
        id: 1,
        text: "The algorithm begins by constructing a minimum spanning tree (MST) of the graph using either Prim’s or Kruskal’s algorithm. This tree connects all vertices with the smallest total edge weight.",
      },
      {
        id: 2,
        text: "Next, it identifies the vertices with odd degrees in the MST. These odd-degree vertices will later be matched to form an Eulerian graph, crucial for finding an optimal TSP route.",
      },
      {
        id: 3,
        text: "A minimum-weight perfect matching is computed for the odd-degree vertices. This step adds the smallest possible edges to pair up all odd-degree vertices without creating cycles.",
      },
      {
        id: 4,
        text: "By combining the minimum spanning tree and the perfect matching, an Eulerian multigraph is formed. This means every vertex has an even degree, allowing for an Eulerian circuit.",
      },
      {
        id: 5,
        text: "The Eulerian circuit is then constructed by tracing through the edges of the multigraph. In this circuit, every edge is visited exactly once, ensuring no redundant paths.",
      },
      {
        id: 6,
        text: "The next step involves converting the Eulerian circuit into a Hamiltonian circuit, which requires visiting each vertex exactly once. This is done using a shortcutting technique.",
      },
      {
        id: 7,
        text: "Shortcutting eliminates repeated visits to vertices while preserving the order of the Eulerian circuit. The result is a Hamiltonian cycle, which serves as the solution to the TSP.",
      },
      {
        id: 8,
        text: "The total weight of this Hamiltonian cycle is guaranteed to be within 1.5 times the optimal solution. Christofides' algorithm ensures a good balance between efficiency and accuracy.",
      },
      {
        id: 9,
        text: "Christofides' algorithm offers a practical approach for approximating TSP solutions, with a proven performance ratio. While not always optimal, it's effective for large-scale problems.",
      },
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
    twoOptTSP,
  };

  return (
    <DemosContext.Provider value={value}>{children}</DemosContext.Provider>
  );
};

export { DemosProvider, DemosContext };
