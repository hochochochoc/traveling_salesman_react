// Function for Christofides Algorithm
import blossom from "edmonds-blossom";
import { twoOptTSP } from "./twoOptTSP";

export const christofidesTSP = (graph, distance) => {
  console.log("Input Graph:", graph);
  const startTime = performance.now();
  const n = graph.length;

  // Compute minimum spanning tree
  const mst = computeMST(graph, distance);
  console.log("Minimum Spanning Tree:", mst);

  // Find odd-degree vertices
  const oddVertices = findOddDegreeVertices(mst, n);
  console.log("Odd Degree Vertices:", oddVertices);

  // Compute minimum-weight perfect matching on odd-degree vertices using Blossom algorithm
  const matching = minimumWeightPerfectMatching(oddVertices, graph, distance);
  console.log("Minimum Weight Perfect Matching:", matching);

  // Combine MST and matching to form a multigraph
  const multigraph = [...mst, ...matching];
  console.log("Multigraph:", multigraph);

  // Compute Eulerian circuit
  const eulerianCircuit = computeEulerianCircuit(multigraph, n);

  // Form a Hamiltonian circuit by skipping repeated vertices
  const hamiltonianCircuit = [];
  const visited = new Set();

  for (const vertex of eulerianCircuit) {
    if (!visited.has(vertex)) {
      hamiltonianCircuit.push(vertex);
      visited.add(vertex);
    }
  }
  hamiltonianCircuit.push(hamiltonianCircuit[0]); // Complete the circuit

  // Convert Hamiltonian circuit to edges
  const edges = [];
  for (let i = 0; i < hamiltonianCircuit.length - 1; i++) {
    const from = hamiltonianCircuit[i];
    const to = hamiltonianCircuit[i + 1];
    edges.push([from, to]);
  }

  // Apply Two-Opt to optimize the Hamiltonian circuit
  const optimizedResult = twoOptTSP(graph, distance);

  const endTime = performance.now();
  const executionTime = endTime - startTime;
  return { edges: optimizedResult.edges, executionTime };
};

// Helper function to compute Minimum Spanning Tree using Kruskal's algorithm
const computeMST = (graph, distance) => {
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
const minimumWeightPerfectMatching = (vertices, graph, distance) => {
  const n = vertices.length;
  const edges = [];

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      edges.push([
        vertices[i],
        vertices[j],
        Math.round(distance(graph[vertices[i]], graph[vertices[j]]) * 1000), // Scale and round the weight
      ]);
    }
  }

  const matching = blossom(edges, true);

  return matching.reduce((acc, match, index) => {
    if (match !== -1 && index < match) {
      acc.push([vertices[index], vertices[match]]);
    }
    return acc;
  }, []);
};

// Helper function to compute Eulerian circuit
const computeEulerianCircuit = (multigraph, n) => {
  if (multigraph.length === 0) {
    console.error("Multigraph is empty. Cannot compute Eulerian circuit.");
    return [];
  }

  const adjacencyList = Array.from({ length: n }, () => []);
  console.log("Initialized Adjacency List:", adjacencyList);

  for (const [from, to] of multigraph) {
    if (from !== undefined && to !== undefined) {
      // Check for undefined values
      adjacencyList[from].push(to);
      adjacencyList[to].push(from);
    }
  }

  console.log("Adjacency List:", adjacencyList); // Log adjacency list

  const circuit = [];
  let startVertex = 0;

  // Find a vertex with odd degree, if exists
  for (let i = 0; i < n; i++) {
    if (adjacencyList[i].length % 2 !== 0) {
      startVertex = i;
      break;
    }
  }

  const stack = [startVertex];

  while (stack.length > 0) {
    const v = stack[stack.length - 1];

    console.log("Current Vertex:", v); // Log current vertex
    console.log("Stack:", stack); // Log current stack

    if (adjacencyList[v].length === 0) {
      circuit.push(v);
      console.log("Circuit after pushing:", circuit); // Log circuit after pushing
      stack.pop();
    } else {
      const u = adjacencyList[v].pop();
      stack.push(u);

      // Remove the edge in both directions
      adjacencyList[u] = adjacencyList[u].filter((x) => x !== v);
    }
  }

  // If the circuit doesn't include all vertices, add missing ones
  const visited = new Set(circuit);
  for (let i = 0; i < n; i++) {
    if (!visited.has(i)) {
      circuit.push(i);
    }
  }

  return circuit;
};
