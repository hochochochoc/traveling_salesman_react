// Kruskal's algorithm implementation
export const kruskalsMST = (graph, distance) => {
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
