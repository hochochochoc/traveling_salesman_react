import React, { useRef, useState, useEffect } from "react";
import { useMapPageContext } from "../context/MapPageContext";
import { useMapPageTSPContext } from "../context/MapPageTSPContext";

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
  const [isFirstRender, setIsFirstRender] = useState(true);
  const shouldShowLabels = useRef(false);
  const {
    selectedCities,
    addSelectedCity,
    updateTotalDistance,
    isTryItYourselfMode,
  } = useMapPageContext();
  const {
    route: tspRoute,
    isCalculatingRoute,
    isTSPRouteCalculated,
    setIsTSPRouteCalculated,
    isTSPMode,
  } = useMapPageTSPContext();

  const citiesZoomLimit = zoom < 2.6 ? 2.4 : zoom < 3.3 ? 1.6 : 1.3;

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

    return () => {};
  }, []);

  const updateMarkerLabels = () => {
    if (mapInstance.current && mapInstance.current.markers) {
      const currentZoom = mapInstance.current.getZoom();
      const shouldShow = currentZoom >= initialZoom.current * citiesZoomLimit;

      mapInstance.current.markers.forEach((marker) => {
        const isSelected = selectedCities.find(
          (city) => city.name === marker.getTitle(),
        );
        if (shouldShow) {
          marker.setLabel({
            text: marker.getTitle(),
            color: "black",
            fontSize: "11px",
            className:
              "transition-all font-semibold duration-200 -translate-y-4",
          });
        } else {
          marker.setLabel(null);
        }
      });
    }
  };

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
          shouldShowLabels.current =
            mapInstance.current.getZoom() >=
            initialZoom.current * citiesZoomLimit;
          updateMarkerLabels();
        });

        mapInstance.current.markers = [];
        mapInstance.current.polylines = [];
      } else {
        mapInstance.current.setCenter(center);
        mapInstance.current.setZoom(zoom);
      }

      if (mapInstance.current.markers) {
        mapInstance.current.markers.forEach((marker) => marker.setMap(null));
        mapInstance.current.markers = [];
      }

      if (Array.isArray(cities) && cities.length > 0) {
        if (isFirstRender) {
          cities.forEach((city, index) => {
            setTimeout(() => {
              addMarker(city);
              if (index === cities.length - 1) {
                setIsFirstRender(false);
                updateMarkerLabels();
                if (isTryItYourselfMode) {
                  updatePolylines();
                } else {
                  updateTSPPolylines();
                }
              }
            }, index * 100);
          });
        } else {
          cities.forEach(addMarker);
          updateMarkerLabels();
          if (isTryItYourselfMode) {
            updatePolylines();
          } else {
            updateTSPPolylines();
          }
        }
      }
    }
  }, [
    mapLoaded,
    center,
    zoom,
    cities,
    selectedCities,
    isTryItYourselfMode,
    tspRoute,
    isCalculatingRoute,
  ]);

  const addMarker = (city) => {
    const isSelected = selectedCities.includes(city);

    // Create regular marker for label functionality
    const marker = new window.google.maps.Marker({
      position: { lat: city.latitude, lng: city.longitude },
      map: mapInstance.current,
      title: city.name,
      visible: false,
    });

    class CustomOverlay extends window.google.maps.OverlayView {
      constructor(city, marker) {
        super();
        this.city = city;
        this.marker = marker;
        this.div = null;
        this.labelDiv = null; // Add reference to label div
      }

      onAdd() {
        // Create wrapper div for both pin and label
        const wrapper = document.createElement("div");
        wrapper.style.position = "absolute";
        wrapper.style.pointerEvents = "none";

        // Create pin div (existing code)
        this.div = document.createElement("div");
        this.div.style.position = "absolute";
        this.div.style.transform = "translate(-0%, -6px)";
        this.div.style.width = "12px";
        this.div.style.height = "14px";
        this.div.style.backgroundImage = "url('/pin_icon.png')";
        this.div.style.backgroundSize = "cover";
        this.div.style.cursor = "pointer";
        this.div.style.zIndex = isSelected ? "1" : "2";
        this.div.style.pointerEvents = "auto";

        // Create label div
        this.labelDiv = document.createElement("div");
        this.labelDiv.style.position = "absolute";
        this.labelDiv.style.left = "0%";
        this.labelDiv.style.transform = "translate(-40%, -18px)";
        this.labelDiv.style.backgroundColor = "";
        this.labelDiv.style.padding = "";
        this.labelDiv.style.borderRadius = "2px";
        this.labelDiv.style.fontSize = "11px";
        this.labelDiv.style.fontWeight = "600";
        this.labelDiv.style.whiteSpace = "nowrap";
        this.labelDiv.style.opacity = "0";
        this.labelDiv.style.transition = "opacity 0.2s";
        this.labelDiv.textContent = this.city.name;

        wrapper.appendChild(this.labelDiv);
        wrapper.appendChild(this.div);

        this.div.addEventListener("click", () => {
          if (isTryItYourselfMode) {
            handleCityClick(this.city);
            this.div.style.zIndex = "1";
          }
        });

        const panes = this.getPanes();
        panes.overlayImage.appendChild(wrapper);
      }

      draw() {
        const overlayProjection = this.getProjection();
        const position = overlayProjection.fromLatLngToDivPixel(
          new window.google.maps.LatLng(
            this.city.latitude,
            this.city.longitude,
          ),
        );

        if (position) {
          const wrapper = this.div.parentNode;
          wrapper.style.left = `${position.x - 6}px`;
          wrapper.style.top = `${position.y - 7}px`;
        }
      }

      onRemove() {
        if (this.div) {
          this.div.parentNode.parentNode.removeChild(this.div.parentNode);
          this.div = null;
          this.labelDiv = null;
        }
      }

      getTitle() {
        return this.city.name;
      }

      setLabel(labelOptions) {
        if (this.labelDiv) {
          this.labelDiv.style.opacity = labelOptions ? "1" : "0";
        }
      }
    }

    const customMarker = new CustomOverlay(city, marker);
    customMarker.setMap(mapInstance.current);

    mapInstance.current.markers.push(customMarker);
  };

  const handleCityClick = (city) => {
    if (isTryItYourselfMode) {
      addSelectedCity(city);
      updatePolylines();
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
    if (mapInstance.current && window.google && window.google.maps) {
      clearPolylines();

      if (isTryItYourselfMode) {
        updatePolylines();
      } else if (isTSPMode && isTSPRouteCalculated) {
        updateTSPPolylines();
      }
    }
  }, [
    isTryItYourselfMode,
    isTSPMode,
    isTSPRouteCalculated,
    selectedCities,
    tspRoute,
  ]);

  const updatePolylines = () => {
    if (
      mapInstance.current &&
      selectedCities.length > 1 &&
      window.google &&
      window.google.maps &&
      window.google.maps.geometry &&
      selectedCities[0]?.latitude !== undefined // Add this check
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

      updateTotalDistance(totalDistance / 1000);
    }
  };

  const updateTSPPolylines = () => {
    if (
      mapInstance.current &&
      tspRoute.length > 1 &&
      window.google &&
      window.google.maps &&
      window.google.maps.geometry
    ) {
      clearPolylines();

      // Add polyline for the complete route, including return to start
      const routeWithReturn = [...tspRoute, tspRoute[0]];
      const totalAnimationTime = (routeWithReturn.length - 1) * 100 + 300;

      routeWithReturn.slice(1).forEach((_, index) => {
        setTimeout(() => {
          const start = routeWithReturn[index];
          const end = routeWithReturn[index + 1];

          const path = [
            { lat: start.latitude, lng: start.longitude },
            { lat: end.latitude, lng: end.longitude },
          ];

          const polyline = new window.google.maps.Polyline({
            path: path,
            geodesic: true,
            strokeColor: "#FF1111",
            strokeOpacity: 1.0,
            strokeWeight: 2,
            map: mapInstance.current,
          });

          mapInstance.current.polylines.push(polyline);
        }, index * 100);
      });

      // Single timeout for the completion event, after all animations plus delay
      setTimeout(() => {
        const event = new CustomEvent("tspAnimationComplete");
        window.dispatchEvent(event);
      }, totalAnimationTime);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl">
      <div
        ref={mapRef}
        className="absolute inset-[-50px]"
        style={{ width: "calc(100% + 100px)", height: "calc(100% + 100px)" }}
      />
    </div>
  );
});

export default CountryMap;
