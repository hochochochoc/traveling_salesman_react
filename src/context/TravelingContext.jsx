import React, { createContext, useContext, useState, useEffect } from "react";

const TravelingContext = createContext();

const calculateZoomLevel = (area) => {
  const m = -2.29e-7;
  const c = 4.6;
  const zoom = Math.max(1, Math.min(20, m * area + c));
  return zoom;
};

const useTravelingData = () => useContext(TravelingContext);

const TravelingProvider = ({ children }) => {
  const [countryCenters, setCountryCenters] = useState({});
  const [zoomLevels, setZoomLevels] = useState({});
  const [countryFlags, setCountryFlags] = useState({});
  const [countryAreas, setCountryAreas] = useState({});
  const [selectedCountries, setSelectedCountries] = useState([
    "Brazil",
    "Spain",
    "Egypt",
    "Bangladesh",
    "Vietnam",
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fixedValues = {
    Argentina: { zoom: 3.28, center: { lat: -40.7617, lng: -63.7954 } },
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
    Fiji: { zoom: 6, center: { lat: -17.7137, lng: 178.065 } },
    Japan: { zoom: 4.4, center: { lat: 39.3123, lng: 138.1315 } },
  };

  const setNewCountry = async (countryName) => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}?fullText=true`,
      );
      const data = await response.json();

      if (data.length > 0) {
        const country = data[0];
        const formattedCountryName = country.name.common;

        // Update all the state objects with the new country data
        setCountryCenters((prev) => ({
          ...prev,
          [formattedCountryName]: fixedValues[formattedCountryName]?.center || {
            lat: country.latlng[0],
            lng: country.latlng[1],
          },
        }));

        setZoomLevels((prev) => ({
          ...prev,
          [formattedCountryName]:
            fixedValues[formattedCountryName]?.zoom ||
            calculateZoomLevel(country.area),
        }));

        setCountryFlags((prev) => ({
          ...prev,
          [formattedCountryName]: country.flags.png,
        }));

        setCountryAreas((prev) => ({
          ...prev,
          [formattedCountryName]: country.area.toLocaleString(),
        }));

        setSelectedCountries([formattedCountryName]);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error fetching new country data:", error);
      return false;
    }
  };

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/independent?status=true")
      .then((response) => response.json())
      .then((data) => {
        const centers = {};
        const zooms = {};
        const flags = {};
        const areas = {};

        data.forEach((country) => {
          if (selectedCountries.includes(country.name.common)) {
            if (fixedValues[country.name.common]) {
              centers[country.name.common] =
                fixedValues[country.name.common].center;
              zooms[country.name.common] =
                fixedValues[country.name.common].zoom;
            } else {
              centers[country.name.common] = {
                lat: country.latlng[0],
                lng: country.latlng[1],
              };
              zooms[country.name.common] = calculateZoomLevel(country.area);
            }

            flags[country.name.common] = country.flags.png;
            areas[country.name.common] = country.area.toLocaleString();
          }
        });

        setCountryCenters(centers);
        setZoomLevels(zooms);
        setCountryFlags(flags);
        setCountryAreas(areas);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
      });
  }, [selectedCountries]);

  return (
    <TravelingContext.Provider
      value={{
        countryCenters,
        zoomLevels,
        countryFlags,
        countryAreas,
        selectedCountries,
        setNewCountry,
        loading,
        error,
      }}
    >
      {children}
    </TravelingContext.Provider>
  );
};

export { TravelingProvider, TravelingContext, useTravelingData };
