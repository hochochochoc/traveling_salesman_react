import { nearestNeighborTSP } from "./nearestTSP";

// Function for 2-Opt method
export const twoOptTSP = (graph, distance) => {
  const startTime = performance.now();
  console.log("Starting Two-Opt TSP Crossing Removal optimization");

  // Helper function to calculate total tour distance
  const calculateTourDistance = (tour) => {
    let totalDistance = 0;
    for (let i = 0; i < tour.length - 1; i++) {
      totalDistance += distance(graph[tour[i]], graph[tour[i + 1]]);
    }
    totalDistance += distance(graph[tour[tour.length - 1]], graph[tour[0]]); // Complete the loop
    return totalDistance;
  };

  // Function to check if two line segments intersect
  const doIntersect = (p1, q1, p2, q2) => {
    const orientation = (p, q, r) => {
      const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
      if (val === 0) return 0; // Collinear
      return val > 0 ? 1 : 2; // Clockwise or counterclockwise
    };

    const onSegment = (p, q, r) => {
      return (
        q.x <= Math.max(p.x, r.x) &&
        q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) &&
        q.y >= Math.min(p.y, r.y)
      );
    };

    const o1 = orientation(p1, q1, p2);
    const o2 = orientation(p1, q1, q2);
    const o3 = orientation(p2, q2, p1);
    const o4 = orientation(p2, q2, q1);

    if (o1 !== o2 && o3 !== o4) return true;
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;

    return false;
  };

  // Get initial tour from nearest neighbor
  const { edges: initialEdges } = nearestNeighborTSP(graph, distance);
  let tour = initialEdges.map((edge) => edge[0]);
  console.log("Initial tour:", tour);
  console.log("Initial tour distance:", calculateTourDistance(tour));

  // 2-opt swap function
  const twoOptSwap = (tour, i, k) => {
    const newTour = [...tour];
    while (i < k) {
      [newTour[i], newTour[k]] = [newTour[k], newTour[i]];
      i++;
      k--;
    }
    return newTour;
  };

  let crossingsRemoved;
  let iterationCount = 0;
  const maxIterations = 100; // Set iteration limit

  do {
    crossingsRemoved = false;
    iterationCount++;
    console.log(`\nIteration: ${iterationCount}, Checking for crossings...`);

    for (let i = 0; i < tour.length - 1; i++) {
      for (let k = i + 2; k < tour.length; k++) {
        // Ignore adjacent edges and wrap around
        if (k === (i + 1) % tour.length) continue;

        const a = graph[tour[i]];
        const b = graph[tour[(i + 1) % tour.length]];
        const c = graph[tour[k]];
        const d = graph[tour[(k + 1) % tour.length]];

        if (doIntersect(a, b, c, d)) {
          const newTour = twoOptSwap(tour, i + 1, k);
          const newDistance = calculateTourDistance(newTour);

          // Check if the new tour is an improvement
          if (newDistance < calculateTourDistance(tour)) {
            tour = newTour;
            crossingsRemoved = true;

            console.log(`  Crossing detected and removed: i=${i}, k=${k}`);
            console.log(`    New tour: ${tour}`);
            console.log(`    New distance: ${newDistance}`);

            // Restart checking from the beginning
            i = -1;
            break;
          }
        }
      }
      if (crossingsRemoved) break;
    }

    // Break if the iteration limit is reached
    if (iterationCount >= maxIterations) {
      console.log(`Iteration limit of ${maxIterations} reached.`);
      break;
    }
  } while (crossingsRemoved);

  if (crossingsRemoved) {
    console.log("Final tour is crossing-free!");
  } else {
    console.warn("Reached iteration limit without fully optimizing the tour.");
  }

  // Convert the optimized tour back to edge format
  const edges = tour.map((node, index) => [
    node,
    tour[(index + 1) % tour.length],
  ]);

  console.log("\nFinal tour:", tour);
  console.log("Final tour distance:", calculateTourDistance(tour));

  const endTime = performance.now();
  const executionTime = endTime - startTime;

  return { edges, executionTime };
};
