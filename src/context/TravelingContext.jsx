import React, { createContext, useContext, useState, useEffect } from "react";

const TravelingContext = createContext();

const calculateZoomLevel = (area) => {
  const m = -2.29e-7; // Slope
  const c = 4.4545; // Y-intercept
  const zoom = Math.max(1, Math.min(20, m * area + c)); // Clamp between 1 and 20
  // console.log(`Calculating zoom level for area ${area}: ${zoom}`);
  return zoom;
};

const useTravelingData = () => useContext(TravelingContext);

const TravelingProvider = ({ children }) => {
  const [countryCenters, setCountryCenters] = useState({});
  const [zoomLevels, setZoomLevels] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const selectedCountries = ["Brazil", "China", "Spain", "Tanzania"];

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/independent?status=true")
      .then((response) => response.json())
      .then((data) => {
        const centers = {};
        const zooms = {};
        data.forEach((country) => {
          if (selectedCountries.includes(country.name.common)) {
            centers[country.name.common] = {
              lat: country.latlng[0],
              lng: country.latlng[1],
            };
            const zoom = calculateZoomLevel(country.area);
            zooms[country.name.common] = zoom;
            // console.log(
            //   `Country: ${country.name.common}, Area: ${country.area}, Zoom: ${zoom}`,
            // ); // Log each country's zoom level
          }
        });

        setCountryCenters(centers);
        setZoomLevels(zooms);
        setLoading(false);
      })
      .catch((error) => {
        // console.error("Error fetching country data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);

  return (
    <TravelingContext.Provider
      value={{ countryCenters, zoomLevels, loading, error }}
    >
      {children}
    </TravelingContext.Provider>
  );
};

export { TravelingProvider, TravelingContext, useTravelingData };
