import { nearestNeighbor } from "./nearestTSPMap";

export const twoOptTSPMap = (cities, calculateDistance) => {
  // Start with the nearest neighbor solution
  let bestRoute = nearestNeighbor(cities, calculateDistance);
  let bestDistance = calculateTotalDistance(bestRoute, calculateDistance);

  const MAX_ITERATIONS = 1000;
  let iterations = 0;

  while (iterations < MAX_ITERATIONS) {
    let improvement = false;
    for (let i = 0; i < bestRoute.length - 3; i++) {
      for (let j = i + 2; j < bestRoute.length - 1; j++) {
        const newRoute = twoOptSwap(bestRoute, i, j);
        const newDistance = calculateTotalDistance(newRoute, calculateDistance);

        if (newDistance < bestDistance) {
          bestRoute = newRoute;
          bestDistance = newDistance;
          improvement = true;
          break; // Break inner loop to start over with the new best route
        }
      }
      if (improvement) break; // Break outer loop to start over with the new best route
    }

    if (!improvement) break; // If no improvement was found, we're done
    iterations++;
  }

  return { route: bestRoute };
};

const calculateTotalDistance = (route, calculateDistance) => {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += calculateDistance(route[i], route[i + 1]);
  }
  return totalDistance;
};

const twoOptSwap = (route, i, j) => {
  const newRoute = route.slice(0, i + 1);
  newRoute.push(...route.slice(i + 1, j + 1).reverse());
  newRoute.push(...route.slice(j + 1));
  return newRoute;
};
