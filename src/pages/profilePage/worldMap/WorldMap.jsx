import React from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import countryList from "@/pages/landingPage/components/maps/searchbar/countryList";

const WorldMap = ({ userRounds = [] }) => {
  const highlightedCountries = userRounds.reduce((acc, round) => {
    acc[round.country] = "#1276FF";
    return acc;
  }, {});

  return (
    <div className="mx-auto w-full max-w-4xl">
      <ComposableMap>
        <Geographies geography="/world-map.json">
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill={
                  highlightedCountries[geo.properties.name]
                    ? "#1276D3"
                    : countryList.includes(geo.properties.name)
                      ? "#C3E2FD"
                      : "#D6D6DA"
                }
                stroke="#FFFFFF"
                className="transition-opacity hover:opacity-80"
              />
            ))
          }
        </Geographies>
      </ComposableMap>
    </div>
  );
};

export default WorldMap;
