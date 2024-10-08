import React, { useEffect, useRef, useState } from "react";

const loadGoogleMapsScript = (callback) => {
  if (window.google && window.google.maps) {
    // console.log("Google Maps already loaded.");
    callback();
    return;
  }

  const existingScript = document.getElementById("googleMapsScript");
  if (!existingScript) {
    console.log("Loading Google Maps script...");
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyByE64wA61IlqrLScEBn6dUig4zx8liL44&libraries=places`;
    script.id = "googleMapsScript";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Google Maps script loaded successfully.");
      callback();
    };
    script.onerror = () => {
      console.error("Error loading Google Maps script.");
    };
    document.body.appendChild(script);
  } else {
    console.log("Google Maps script already exists.");
    callback();
  }
};

const MapTest = ({ center, zoom }) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript(() => {
      // console.log("Map loading initiated.");
      setMapLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (mapLoaded && window.google && mapRef.current) {
      // console.log(`Loading map with zoom level: ${zoom}`);
      const { Map } = window.google.maps;
      new Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: false,
        fullscreenControl: false,
        gestureHandling: "none",
        styles: [
          {
            featureType: "administrative",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
          { featureType: "poi", stylers: [{ visibility: "off" }] },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "water",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });
    }
  }, [mapLoaded, center, zoom]);

  return (
    <div className="relative h-36 w-56 overflow-hidden">
      <div
        ref={mapRef}
        className="absolute inset-[-50px]"
        style={{ width: "calc(100% + 100px)", height: "calc(100% + 100px)" }}
      />
    </div>
  );
};

export default MapTest;

// TODO
// still doesn't work when loading first time...
// rename things
