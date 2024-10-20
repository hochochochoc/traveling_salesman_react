import React, { createContext, useContext, useState, useCallback } from "react";
import { nearestNeighbor } from "../functions/nearestTSPMap";
import { greedyTSPMap } from "../functions/greedyTSPMap";
import { twoOptTSPMap } from "../functions/twoOptTSPMap";

const MapPageTSPContext = createContext();

export const useMapPageTSPContext = () => useContext(MapPageTSPContext);

export const MapPageTSPProvider = ({ children }) => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState("alg1");
  const [route, setRoute] = useState([]);
  const [totalDistanceTSP, settotalDistanceTSP] = useState(0);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [isTSPRouteCalculated, setIsTSPRouteCalculated] = useState(false);
  const [isTSPMode, setIsTSPMode] = useState(false);

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

  const clearTSPRoute = useCallback(() => {
    setRoute([]);
    settotalDistanceTSP(0);
    setIsTSPRouteCalculated(false);
    setIsTSPMode(false);
  }, []);

  const calculateRoute = useCallback(
    (cities) => {
      setIsCalculatingRoute(true);
      setIsTSPRouteCalculated(false);
      setIsTSPMode(true);

      let optimalRoute;
      if (selectedAlgorithm === "alg1") {
        optimalRoute = nearestNeighbor(cities, calculateDistance);
        console.log("worked using nearest neighbor");
      } else if (selectedAlgorithm === "alg2") {
        const result = greedyTSPMap(cities, calculateDistance);
        optimalRoute = result.route;
        console.log("worked using greedy heuristic");
      } else if (selectedAlgorithm === "alg3") {
        const result = twoOptTSPMap(cities, calculateDistance);
        optimalRoute = result.route;
        console.log("worked using two opt method");
      } else if (selectedAlgorithm === "alg4") {
        const result = twoOptTSPMap(cities, calculateDistance);
        optimalRoute = result.route;
        console.log("worked using christofides method");
      } else {
        optimalRoute = cities;
        console.log("Didn't work");
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
    [selectedAlgorithm, calculateDistance],
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
        isTSPMode,
        setIsTSPMode,
        clearTSPRoute,
      }}
    >
      {children}
    </MapPageTSPContext.Provider>
  );
};
