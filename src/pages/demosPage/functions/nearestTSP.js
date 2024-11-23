// Nearest Neighbor TSP implementation
export const nearestNeighborTSP = (graph, distance) => {
  const startTime = performance.now();
  const n = graph.length;
  const visited = new Set();
  const tour = [];
  let currentNode = Math.floor(Math.random() * n);
  visited.add(currentNode);
  tour.push(currentNode);

  // Store potential edges and distances
  const potentialEdges = [];

  while (visited.size < n) {
    let nearestNode = null;
    let nearestDistance = Infinity;

    for (let i = 0; i < n; i++) {
      if (!visited.has(i)) {
        const dist = distance(graph[currentNode], graph[i]);
        if (dist < nearestDistance) {
          nearestNode = i;
          nearestDistance = dist;
        }
        // Store potential next edge
        potentialEdges.push({ from: currentNode, to: i, distance: dist });
      }
    }

    if (nearestNode !== null) {
      visited.add(nearestNode);
      tour.push(nearestNode);
      currentNode = nearestNode;
    }
  }

  tour.push(tour[0]);

  const edges = [];
  for (let i = 0; i < tour.length - 1; i++) {
    edges.push([tour[i], tour[i + 1]]);
  }

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return { edges, potentialEdges, executionTime }; // Return potential edges
};
