export const greedyTSPMap = (graph, calculateDistance) => {
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
        distance: calculateDistance(graph[i], graph[j]),
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

  // Reconstruct the route from the edges
  const visited = new Set();

  if (edges.length === 0) {
    console.error("No edges were selected. Cannot create route.");
    return { route: [], executionTime: performance.now() - startTime };
  }

  let route = [graph[edges[0][0]]]; // Start with the first city in the first edge
  let lastCity = edges[0][1];
  visited.add(edges[0][0]);
  visited.add(lastCity);
  route.push(graph[lastCity]);

  // Build the route using the edges
  while (visited.size < graph.length) {
    const nextEdge = edges.find(
      (edge) =>
        (edge[0] === lastCity && !visited.has(edge[1])) ||
        (edge[1] === lastCity && !visited.has(edge[0])),
    );
    if (nextEdge) {
      lastCity = nextEdge[0] === lastCity ? nextEdge[1] : nextEdge[0];
      visited.add(lastCity);
      route.push(graph[lastCity]);
    }
  }

  // Return to the starting city to complete the loop
  route.push(graph[edges[0][0]]);

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return { route, executionTime };
};
