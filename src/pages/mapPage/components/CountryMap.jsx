import React, { useRef, useState, useEffect } from "react";

const CountryMap = React.memo(({ center, zoom, cities }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const initialZoom = useRef(zoom);

  useEffect(() => {
    const loadGoogleMapsScript = (callback) => {
      if (window.google && window.google.maps) {
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
    if (mapLoaded && window.google && mapRef.current) {
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
      } else {
        mapInstance.current.setCenter(center);
        mapInstance.current.setZoom(zoom);
      }

      // Clear existing markers
      if (mapInstance.current.markers) {
        mapInstance.current.markers.forEach((marker) => marker.setMap(null));
      }
      mapInstance.current.markers = [];

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
          mapInstance.current.markers.push(marker);
        });
      }

      updateMarkerLabels();
    }
  }, [mapLoaded, center, zoom, cities]);

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

// easy light fix: Only show labels when zoomed in a certain amount
// Brazil:
