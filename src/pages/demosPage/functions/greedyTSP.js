// Function for greedy algorithm
export const cheapestInsertionTSP = (graph, distance) => {
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
