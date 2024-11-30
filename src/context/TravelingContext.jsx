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
    "Bangladesh",
    "Egypt",
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
    Japan: { zoom: 4.3, center: { lat: 39.3123, lng: 138.1315 } },
    Malaysia: { zoom: 4.2, center: { lat: 4.2105, lng: 108.9758 } },
    Myanmar: { zoom: 4.4, center: { lat: 19.4162, lng: 95.956 } },
    Chile: { zoom: 3.1, center: { lat: -38.6751, lng: -72.543 } },
    Nigeria: { zoom: 4.9, center: { lat: 9.082, lng: 8.6753 } },
    Portugal: { zoom: 5.7, center: { lat: 39.3999, lng: -8.2245 } },
    Ghana: { zoom: 5.8, center: { lat: 7.9465, lng: -1.0232 } },
    Norway: { zoom: 3.5, center: { lat: 65.472, lng: 14.4689 } },
    Guatemala: { zoom: 6.2, center: { lat: 15.7835, lng: -90.2308 } },
    Finland: { zoom: 4.1, center: { lat: 65.5241, lng: 25.7482 } },
    Benin: { zoom: 5.85, center: { lat: 9.3077, lng: 2.3158 } },
    Netherlands: { zoom: 6.4, center: { lat: 52.1326, lng: 5.2913 } },
    Nepal: { zoom: 5.2, center: { lat: 28.3949, lng: 84.124 } },
    Hungary: { zoom: 5.8, center: { lat: 47.1625, lng: 19.5033 } },
    Cambodia: { zoom: 5.8, center: { lat: 12.5657, lng: 104.991 } },
    Malawi: { zoom: 5.6, center: { lat: -13.2543, lng: 34.3015 } },
    Ireland: { zoom: 5.8, center: { lat: 53.2798, lng: -7.5055 } },
    Ecuador: { zoom: 5.6, center: { lat: -1.8312, lng: -78.1834 } },
    Uruguay: { zoom: 5.8, center: { lat: -32.5228, lng: -55.7658 } },
    Laos: { zoom: 5.4, center: { lat: 18.2563, lng: 103.7955 } },
    Senegal: { zoom: 5.6, center: { lat: 14.4974, lng: -14.4524 } },
    Philippines: { zoom: 4.8, center: { lat: 12.2797, lng: 122.574 } },
    Kazakhstan: { zoom: 3.2, center: { lat: 48.0196, lng: 66.9237 } },
    Morocco: { zoom: 4.75, center: { lat: 32.7917, lng: -7.0926 } },
    Ethiopia: { zoom: 4.55, center: { lat: 9.145, lng: 40.4897 } },
    Somalia: { zoom: 4.75, center: { lat: 5.1521, lng: 46.1996 } },
    Cuba: { zoom: 5.25, center: { lat: 21.5218, lng: -79.3812 } },
    Russia: { zoom: 1.35, center: { lat: 61.524, lng: 105.3188 } },
    Greece: { zoom: 5.35, center: { lat: 38.5742, lng: 23.5243 } },
    Madagascar: { zoom: 4.75, center: { lat: -18.7669, lng: 46.8691 } },
    Ukraine: { zoom: 4.25, center: { lat: 48.3794, lng: 31.1656 } },
    Tanzania: { zoom: 4.85, center: { lat: -6.369, lng: 34.8888 } },
  };

  const fetchCountryData = async (countryName) => {
    try {
      const response = await fetch(
        `https://restcountries.com/v3.1/name/${countryName}?fullText=true`,
      );
      const data = await response.json();

      if (data.length > 0) {
        const country = data[0];
        const formattedCountryName = country.name.common;

        return {
          name: formattedCountryName,
          center: fixedValues[formattedCountryName]?.center || {
            lat: country.latlng[0],
            lng: country.latlng[1],
          },
          zoom:
            fixedValues[formattedCountryName]?.zoom ||
            calculateZoomLevel(country.area),
          flag: country.flags.png,
          area: country.area.toLocaleString(),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching country data:", error);
      return null;
    }
  };

  const setNewCountries = async (countryNames) => {
    try {
      // Convert single country to array
      const countries = Array.isArray(countryNames)
        ? countryNames
        : [countryNames];

      // Fetch data for all countries in parallel
      const countryDataPromises = countries.map((country) =>
        fetchCountryData(country),
      );
      const countryDataResults = await Promise.all(countryDataPromises);

      // Filter out any failed requests
      const validCountryData = countryDataResults.filter(
        (data) => data !== null,
      );

      if (validCountryData.length === 0) return false;

      // Update all state objects with the new country data
      const newCenters = {};
      const newZooms = {};
      const newFlags = {};
      const newAreas = {};
      const newSelectedCountries = [];

      validCountryData.forEach((country) => {
        newCenters[country.name] = country.center;
        newZooms[country.name] = country.zoom;
        newFlags[country.name] = country.flag;
        newAreas[country.name] = country.area;
        newSelectedCountries.push(country.name);
      });

      setCountryCenters((prev) => ({ ...prev, ...newCenters }));
      setZoomLevels((prev) => ({ ...prev, ...newZooms }));
      setCountryFlags((prev) => ({ ...prev, ...newFlags }));
      setCountryAreas((prev) => ({ ...prev, ...newAreas }));
      setSelectedCountries(newSelectedCountries);

      return true;
    } catch (error) {
      console.error("Error setting new countries:", error);
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
  }, []);

  return (
    <TravelingContext.Provider
      value={{
        countryCenters,
        zoomLevels,
        countryFlags,
        countryAreas,
        selectedCountries,
        setNewCountries,
        loading,
        error,
      }}
    >
      {children}
    </TravelingContext.Provider>
  );
};

export { TravelingProvider, TravelingContext, useTravelingData };
