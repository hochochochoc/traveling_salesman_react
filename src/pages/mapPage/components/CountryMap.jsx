import React, { useRef, useState, useEffect } from "react";
import { useMapPageContext } from "../context/MapPageContext";

// Global state for loading the Google Maps script
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
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyByE64wA61IlqrLScEBn6dUig4zx8liL44&libraries=places,geometry`;
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

const CountryMap = React.memo(({ center, zoom, cities }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const initialZoom = useRef(zoom);
  const {
    selectedCities,
    addSelectedCity,
    updateTotalDistance,
    isTryItYourselfMode,
  } = useMapPageContext();

  useEffect(() => {
    const initializeMap = async () => {
      try {
        await loadGoogleMapsScript();
        setMapLoaded(true);
      } catch (error) {
        console.error("Error loading Google Maps script:", error);
      }
    };

    initializeMap();

    return () => {
      // Cleanup function to reset anything if needed
    };
  }, []);

  useEffect(() => {
    if (mapLoaded && window.google && window.google.maps && mapRef.current) {
      if (!mapInstance.current) {
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

        initialZoom.current = zoom;

        mapInstance.current.addListener("zoom_changed", () => {
          updateMarkerLabels();
        });

        // Initialize marker and polyline arrays
        mapInstance.current.markers = [];
        mapInstance.current.polylines = [];
      } else {
        mapInstance.current.setCenter(center);
        mapInstance.current.setZoom(zoom);
      }

      // Clear existing markers
      if (mapInstance.current.markers) {
        mapInstance.current.markers.forEach((marker) => marker.setMap(null));
        mapInstance.current.markers = [];
      }

      // Add new markers for cities
      if (Array.isArray(cities) && cities.length > 0) {
        cities.forEach((city) => {
          const marker = new window.google.maps.Marker({
            position: { lat: city.latitude, lng: city.longitude },
            map: mapInstance.current,
            title: city.name,
            icon: {
              url: "/pin_icon.png",
              scaledSize: new google.maps.Size(12, 14),
            },
            label: {
              text: city.name,
              color: "black",
              fontSize: "11px",
              className: "-translate-y-3",
            },
          });

          marker.addListener("click", () => {
            if (isTryItYourselfMode) {
              handleCityClick(city);
            }
          });

          mapInstance.current.markers.push(marker);
        });
      }

      updateMarkerLabels();
      updatePolylines(); // Update polylines based on the current selected cities
    }
  }, [mapLoaded, center, zoom, cities, selectedCities, isTryItYourselfMode]);

  const updateMarkerLabels = () => {
    if (mapInstance.current && mapInstance.current.markers) {
      const currentZoom = mapInstance.current.getZoom();
      const showLabels = currentZoom >= initialZoom.current * 1.3;

      mapInstance.current.markers.forEach((marker) => {
        if (showLabels) {
          marker.setLabel({
            text: marker.getTitle(),
            color: "",
            fontSize: "11px",
            className: "-translate-y-3.5  font-semibold text-gray-700",
          });
        } else {
          marker.setLabel(null);
        }
      });
    }
  };

  const handleCityClick = (city) => {
    if (isTryItYourselfMode) {
      addSelectedCity(city);
      updatePolylines();
    }
  };

  const updatePolylines = () => {
    if (
      mapInstance.current &&
      selectedCities.length > 1 &&
      window.google &&
      window.google.maps &&
      window.google.maps.geometry
    ) {
      clearPolylines();

      let totalDistance = 0;

      for (let i = 1; i < selectedCities.length; i++) {
        const start = selectedCities[i - 1];
        const end = selectedCities[i];

        const path = [
          { lat: start.latitude, lng: start.longitude },
          { lat: end.latitude, lng: end.longitude },
        ];

        const polyline = new window.google.maps.Polyline({
          path: path,
          geodesic: true,
          strokeColor: "#FF0000",
          strokeOpacity: 1.0,
          strokeWeight: 2,
          map: mapInstance.current,
        });

        mapInstance.current.polylines.push(polyline);

        totalDistance +=
          window.google.maps.geometry.spherical.computeDistanceBetween(
            new window.google.maps.LatLng(start.latitude, start.longitude),
            new window.google.maps.LatLng(end.latitude, end.longitude),
          );
      }

      updateTotalDistance(totalDistance / 1000); // Convert to kilometers
    }
  };

  const clearPolylines = () => {
    if (mapInstance.current && mapInstance.current.polylines) {
      mapInstance.current.polylines.forEach((polyline) =>
        polyline.setMap(null),
      );
      mapInstance.current.polylines = [];
    }
  };

  useEffect(() => {
    if (!isTryItYourselfMode) {
      clearPolylines();
    } else {
      updatePolylines();
    }
  }, [isTryItYourselfMode, selectedCities]);

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
