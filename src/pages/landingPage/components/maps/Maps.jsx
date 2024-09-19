import React, { useState, useEffect } from "react";
import NiceButtons from "./niceButtons/NiceButtons";
import MapTest from "../maptest/MapTest";
import { useTravelingData } from "../../../../context/TravelingContext";

const countryNames = ["Brazil", "China", "Spain", "Guinea"];

const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    callback();
    return;
  }

  const existingScript = document.getElementById("googleMapsScript");
  if (!existingScript) {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyByE64wA61IlqrLScEBn6dUig4zx8liL44&libraries=places`;
    script.id = "googleMapsScript";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (callback) callback();
    };
  } else if (callback) {
    callback();
  }
};

export default function Maps() {
  const { countryCenters, zoomLevels, loading, error } = useTravelingData();

  if (loading) {
    return <div>Loading country data...</div>;
  }

  if (error) {
    return <div>Error loading country data: {error.message}</div>;
  }

  return (
    <div className="rounded-lg bg-secondary p-4">
      <div className="mb-2 ml-2 font-bold">Choose a map</div>
      <div className="ml-2 pb-4 text-sm">
        Select a country to try out the algorithms.
      </div>
      <div>
        <div className="justify-center md:flex">
          <div className="mb-4 overflow-hidden rounded-lg bg-egg active:scale-95">
            {countryCenters.Brazil && (
              <MapTest
                center={countryCenters.Brazil}
                zoom={zoomLevels.Brazil}
              />
            )}
            <p className="mx-2 my-1 font-bold">Brazil</p>
          </div>
          <div className="mb-4 overflow-hidden rounded-lg bg-egg active:scale-95 md:ml-4">
            {countryCenters.China && (
              <MapTest center={countryCenters.China} zoom={zoomLevels.China} />
            )}
            <p className="mx-2 my-1 font-bold">China</p>
          </div>
        </div>
        <div className="justify-center md:flex">
          <div className="mb-4 overflow-hidden rounded-lg bg-egg active:scale-95 md:mb-0">
            {countryCenters.Spain && (
              <MapTest center={countryCenters.Spain} zoom={zoomLevels.Spain} />
            )}
            <p className="mx-2 my-1 font-bold">Spain</p>
          </div>
          <div className="overflow-hidden rounded-lg bg-egg active:scale-95 md:ml-4">
            {countryCenters.Tanzania && (
              <MapTest
                center={countryCenters.Tanzania}
                zoom={zoomLevels.Tanzania}
              />
            )}
            <p className="mx-2 my-1 font-bold">Tanzania</p>
          </div>
        </div>
        <div className="flex justify-center">
          <NiceButtons />
        </div>
      </div>
    </div>
  );
}
