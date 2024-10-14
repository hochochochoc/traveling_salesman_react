import React, { createContext, useContext, useState, useEffect } from "react";

const TravelingContext = createContext();

const calculateZoomLevel = (area) => {
  const m = -2.29e-7; // Slope
  const c = 4.4; // Y-intercept
  const zoom = Math.max(1, Math.min(20, m * area + c)); // Clamp between 1 and 20
  // console.log(`Calculating zoom level for area ${area}: ${zoom}`);
  return zoom;
};

const useTravelingData = () => useContext(TravelingContext);

const TravelingProvider = ({ children }) => {
  const [countryCenters, setCountryCenters] = useState({});
  const [zoomLevels, setZoomLevels] = useState({});
  const [countryFlags, setCountryFlags] = useState({});
  const [countryAreas, setCountryAreas] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fixedValues = {
    Argentina: { zoom: 2.13, center: { lat: -40.7617, lng: -63.7954 } },
    Brazil: { zoom: 3.16, center: { lat: -14.235, lng: -53.4253 } },
    Bangladesh: { zoom: 5.9, center: { lat: 23.675, lng: 90.3253 } },
    Chad: { zoom: 4.7, center: { lat: 15.7617, lng: 18.7954 } },
    China: { zoom: 2.75, center: { lat: 35.8617, lng: 104.1954 } },
    "DR Congo": { zoom: 4.3, center: { lat: -4.0383, lng: 21.754 } },
    Egypt: { zoom: 4.95, center: { lat: 26.8217, lng: 30.7954 } },
    India: { zoom: 3.62, center: { lat: 21.5617, lng: 81.954 } },
    Indonesia: { zoom: 3.13, center: { lat: -0.7617, lng: 117.3954 } },
    Iran: { zoom: 4.33, center: { lat: 32.4617, lng: 53.6954 } },
    Mexico: { zoom: 3.65, center: { lat: 23.617, lng: -102.5554 } },
    Mongolia: { zoom: 3.53, center: { lat: 46.8617, lng: 103.7954 } },
    Spain: { zoom: 4.7, center: { lat: 39.9937, lng: -3.0492 } },
    Vietnam: { zoom: 4.84, center: { lat: 16.0617, lng: 105.3954 } },
  };

  const selectedCountries = ["Vietnam", "Indonesia", "Bangladesh"];
  //"China", "Spain", "Indonesia"
  // "Brazil", "Mongolia", "Vietnam",

  // Vietnam OUT
  // Thái Thụy
  // Hải Hậu
  // Nghi Sơn
  // Yên Thành
  // Ninh Thuận
  // Kiên Giang

  // Vietnam IN
  // Đổng Hới
  // Đông Hà
  // Dalat
  // Pleiku
  // Tây Ninh
  // Điện Biên Phủ

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/independent?status=true")
      .then((response) => response.json())
      .then((data) => {
        const centers = {};
        const zooms = {};
        const flags = {};
        data.forEach((country) => {
          if (selectedCountries.includes(country.name.common)) {
            // Check if the country has fixed values
            if (fixedValues[country.name.common]) {
              centers[country.name.common] =
                fixedValues[country.name.common].center;
              zooms[country.name.common] =
                fixedValues[country.name.common].zoom;
            } else {
              // Calculate for countries without fixed values
              centers[country.name.common] = {
                lat: country.latlng[0],
                lng: country.latlng[1],
              };
              zooms[country.name.common] = calculateZoomLevel(country.area);
            }

            flags[country.name.common] = country.flags.png;
            // Correct the variable here:
            countryAreas[country.name.common] = country.area.toLocaleString();
          }
        });

        setCountryCenters(centers);
        setZoomLevels(zooms);
        setCountryFlags(flags);
        setCountryAreas(countryAreas);
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
      value={{
        countryCenters,
        zoomLevels,
        countryFlags,
        countryAreas,
        selectedCountries,
        loading,
        error,
      }}
    >
      {children}
    </TravelingContext.Provider>
  );
};

export { TravelingProvider, TravelingContext, useTravelingData };
