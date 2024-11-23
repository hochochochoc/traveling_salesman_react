import React, { useEffect, useRef, useState } from "react";

// Global state to track script loading
let isLoadingScript = false;
let isScriptLoaded = false;
const callbacks = [];

const loadGoogleMapsScript = () => {
  return new Promise((resolve, reject) => {
    if (isScriptLoaded) {
      resolve();
      return;
    }

    if (isLoadingScript) {
      callbacks.push(resolve);
      return;
    }

    isLoadingScript = true;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyByE64wA61IlqrLScEBn6dUig4zx8liL44&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      isScriptLoaded = true;
      isLoadingScript = false;
      callbacks.forEach((cb) => cb());
      callbacks.length = 0;
      resolve();
    };
    script.onerror = () => {
      isLoadingScript = false;
      callbacks.forEach((cb) => cb(new Error("Script loading failed")));
      callbacks.length = 0;
      reject(new Error("Failed to load Google Maps script"));
    };
    document.head.appendChild(script);
  });
};

const MapTest = ({ center, zoom }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript();
        if (
          isMounted &&
          mapRef.current &&
          !map &&
          window.google &&
          window.google.maps
        ) {
          const { Map } = window.google.maps;
          const newMap = new Map(mapRef.current, {
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
          setMap(newMap);
        }
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();

    return () => {
      isMounted = false;
      if (map) {
        // Clean up the map instance if needed
      }
    };
  }, [center, zoom]);

  return (
    <div className="w-76 relative h-80 overflow-hidden">
      <div
        ref={mapRef}
        className="absolute inset-[-50px]"
        style={{ width: "calc(100% + 100px)", height: "calc(100% + 100px)" }}
      />
    </div>
  );
};

export default MapTest;
