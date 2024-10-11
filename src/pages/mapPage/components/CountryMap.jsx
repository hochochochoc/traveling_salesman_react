import React, { useRef, useState, useEffect } from "react";

const CountryMap = React.memo(({ center, zoom }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null); // <-- store the map instance
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const loadGoogleMapsScript = (callback) => {
      if (window.google && window.google.maps) {
        // console.log("Google Maps already loaded.");
        callback();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyByE64wA61IlqrLScEBn6dUig4zx8liL44&libraries=places`;

      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps script loaded successfully.");
        callback();
      };
      script.onerror = () => {
        console.error("Error loading Google Maps script.");
      };
      document.head.appendChild(script);
    };

    loadGoogleMapsScript(() => {
      setMapLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (mapLoaded && window.google && mapRef.current && !mapInstance.current) {
      // Only create the map if it hasn't been created before
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        streetViewControl: false,
        zoomControl: true,
        fullscreenControl: false,
        gestureHandling: "auto",
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
  }, [mapLoaded]);

  useEffect(() => {
    if (mapInstance.current) {
      // If the map already exists, update the center and zoom without reloading
      mapInstance.current.setCenter(center);
      mapInstance.current.setZoom(zoom);
    }
  }, [center, zoom]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={mapRef}
        className="absolute inset-[-50px]"
        style={{ width: "calc(100% + 100px)", height: "calc(100% + 100px)" }}
      />
    </div>
  );
});

export default CountryMap;
