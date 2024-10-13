import React, { createContext, useContext, useState, useCallback } from "react";

const MapPageTSPContext = createContext();

export const useMapPageTSPContext = () => useContext(MapPageTSPContext);

export const MapPageTSPProvider = ({ children }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("alg1");
  const [route, setRoute] = useState([]);
  const [totalDistanceTSP, settotalDistanceTSP] = useState(0);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isTSPRouteCalculated, setIsTSPRouteCalculated] = useState(false);

  const calculateDistance = useCallback((city1, city2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(city2.latitude - city1.latitude);
    const dLon = deg2rad(city2.longitude - city1.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(city1.latitude)) *
        Math.cos(deg2rad(city2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }, []);

  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const nearestNeighbor = useCallback(
    (cities) => {
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

      route.push(route[0]); // Return to starting city
      return route;
    },
    [calculateDistance],
  );

  const calculateRoute = useCallback(
    (cities) => {
      setIsCalculatingRoute(true);
      setIsTSPRouteCalculated(false);

      let optimalRoute;
      if (selectedAlgorithm === "alg1") {
        optimalRoute = nearestNeighbor(cities);
      } else {
        // Implement other algorithms here
        optimalRoute = cities;
      }

      let totalDist = 0;
      for (let i = 1; i < optimalRoute.length; i++) {
        totalDist += calculateDistance(optimalRoute[i - 1], optimalRoute[i]);
      }

      setRoute(optimalRoute);
      settotalDistanceTSP(totalDist);
      setIsCalculatingRoute(false);
      setIsTSPRouteCalculated(true);
    },
    [selectedAlgorithm, nearestNeighbor, calculateDistance],
  );

  return (
    <MapPageTSPContext.Provider
      value={{
        selectedAlgorithm,
        setSelectedAlgorithm,
        route,
        totalDistanceTSP,
        isCalculatingRoute,
        isTSPRouteCalculated,
        setIsTSPRouteCalculated,
        calculateRoute,
      }}
    >
      {children}
    </MapPageTSPContext.Provider>
  );
};
