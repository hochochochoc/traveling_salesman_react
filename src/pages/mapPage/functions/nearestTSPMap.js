export const nearestNeighbor = (cities, calculateDistance) => {
  const route = [cities[0]];
  const unvisited = cities.slice(1);

  while (unvisited.length > 0) {
    const current = route[route.length - 1];
    let nearestCity = unvisited[0];
    let minDistance = calculateDistance(current, nearestCity);

    for (let i = 1; i < unvisited.length; i++) {
      const distance = calculateDistance(current, unvisited[i]);
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = unvisited[i];
      }
    }

    route.push(nearestCity);
    unvisited.splice(unvisited.indexOf(nearestCity), 1);
  }

  route.push(route[0]);
  return route;
};
