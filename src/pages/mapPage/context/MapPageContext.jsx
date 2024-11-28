import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { db } from "../../../../firebaseConfig";
import { useSearchParams } from "react-router-dom";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";

const MapPageContext = createContext();

export const useMapPageContext = () => {
  return useContext(MapPageContext);
};

export const MapPageProvider = ({ children }) => {
  const [searchParams] = useSearchParams();
  const [citiesToBeAdded, setCitiesToBeAdded] = useState(8);
  const [cities, setCities] = useState([]);
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);
  const mapInstance = useRef(null);
  const [selectedCities, setSelectedCities] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [isTryItYourselfMode, setIsTryItYourselfMode] = useState(false);
  const [isTourCompleted, setIsTourCompleted] = useState(false);
  const markersRef = useRef(new Map());
  const labelsRef = useRef(new Map());

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }
  }, []);

  const addSelectedCity = (city) => {
    if (!isTryItYourselfMode) return;

    setSelectedCities((prev) => {
      // Always allow selecting the first city
      if (prev.length === 0) {
        updateMarkerStyle(city, true);
        return [city];
      }

      // Allow completing the tour by selecting the first city again
      if (prev.length > 1 && city.name === prev[0].name) {
        setIsTourCompleted(true);
        return [...prev, city];
      }

      // Prevent selecting a city that's already in the path (except first city for completion)
      const isAlreadySelected = prev.some(
        (selectedCity, index) =>
          // Skip the first city in the check to allow it to be selected again for completion
          index !== 0 && selectedCity.name === city.name,
      );

      if (isAlreadySelected) {
        return prev;
      }

      // Don't allow selecting the same city twice in a row
      if (prev[prev.length - 1].name === city.name) {
        return prev;
      }

      updateMarkerStyle(city, true);
      return [...prev, city];
    });
  };

  const updateMarkerStyle = (city, isSelected) => {
    const marker = markersRef.current.get(city.name);
    const label = labelsRef.current.get(city.name);

    if (marker) {
      // Update marker style with layering effect
      marker.setZIndex(isSelected ? 1 : 2); // Selected cities go to background
      marker.setOpacity(isSelected ? 0.6 : 1); // Reduce opacity of selected cities
      marker.setClickable(
        !isSelected ||
          (selectedCities.length > 1 && city.name === selectedCities[0].name),
      );

      // Update label style to match
      if (label) {
        label.setZIndex(isSelected ? 1 : 2);
        const labelElement = label.labelDiv;
        if (labelElement) {
          labelElement.style.opacity = isSelected ? "0.6" : "1";
          labelElement.style.transition = "opacity 200ms ease-in-out";
        }
      }
    }
  };

  const resetSelectedCities = () => {
    // Reset all markers and labels to original state
    markersRef.current.forEach((marker, cityName) => {
      marker.setOptions({
        zIndex: 2,
        opacity: 1,
        clickable: true,
      });

      const label = labelsRef.current.get(cityName);
      if (label) {
        label.setZIndex(2);
        const labelElement = label.labelDiv;
        if (labelElement) {
          labelElement.style.opacity = "1";
          labelElement.style.transition = "opacity 200ms ease-in-out";
        }
      }
    });

    setSelectedCities([]);
    setTotalDistance(0);
    setIsTourCompleted(false);
  };

  const updateTotalDistance = (distance) => {
    setTotalDistance(distance);
  };

  const toggleTryItYourselfMode = () => {
    setIsTryItYourselfMode((prev) => {
      if (prev) {
        resetSelectedCities();
        setTotalDistance(0);
        clearPolylines();
      }
      return !prev;
    });
  };

  // Function to clear the polylines from the map
  const clearPolylines = () => {
    if (mapInstance.current && mapInstance.current.polylines) {
      mapInstance.current.polylines.forEach((polyline) =>
        polyline.setMap(null),
      );
      mapInstance.current.polylines = [];
    }
  };

  const fetchCities = async (country) => {
    const citiesFromFirebase = await getCitiesFromFirebase(country);

    if (citiesFromFirebase.length >= 30) {
      displayCities(citiesFromFirebase);
    } else {
      await addNewCities(country, citiesFromFirebase.length);
    }
  };

  const getCitiesFromFirebase = async (country) => {
    try {
      const citiesRef = collection(db, "cities");
      const q = query(citiesRef, where("countryName", "==", country));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => doc.data());
    } catch (error) {
      console.error("Error reading from Firebase:", error);
      return [];
    }
  };

  const displayCities = (cities) => {
    const shuffledCities = cities.sort(() => 0.5 - Math.random());
    const selectedCities = shuffledCities.slice(0, citiesToBeAdded);

    setCities(selectedCities);

    addCityMarkers(selectedCities);
  };

  // New function to add city markers to the map
  const addCityMarkers = (selectedCities) => {
    if (mapInstance.current) {
      // Clear existing markers and labels
      markersRef.current.forEach((marker) => marker.setMap(null));
      labelsRef.current.forEach((label) => label.setMap(null));
      markersRef.current.clear();
      labelsRef.current.clear();

      selectedCities.forEach((city) => {
        // Create marker
        const marker = new window.google.maps.Marker({
          position: { lat: city.latitude, lng: city.longitude },
          map: mapInstance.current,
          title: city.name,
          zIndex: 2,
          opacity: 1,
          optimized: false,
          clickable: true,
        });

        // Create label
        const label = new window.google.maps.Marker({
          position: { lat: city.latitude, lng: city.longitude },
          map: mapInstance.current,
          icon: {
            url:
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent('<svg width="1" height="1"></svg>'),
            anchor: new window.google.maps.Point(0, 0),
          },
          label: {
            text: city.name,
            color: "#000000",
            fontSize: "14px",
            fontWeight: "bold",
          },
          zIndex: 2,
          optimized: false,
          clickable: false,
        });

        // Add click event listener to the marker
        marker.addListener("click", () => {
          if (isTryItYourselfMode) {
            addSelectedCity(city);
          }
        });

        // Store references
        markersRef.current.set(city.name, marker);
        labelsRef.current.set(city.name, label);
      });
    }
  };

  const addNewCities = async (country, currentCount, citiesToBeAdded) => {
    setLoading(true);
    setEstimatedTime(5);

    try {
      let totalCalls = 0;
      let offset = 0;

      // Fetch existing cities from Firebase to ensure no duplicates
      const existingCities = new Set();
      const existingCitiesFromFirebase = await getCitiesFromFirebase(country);
      existingCitiesFromFirebase.forEach((city) =>
        existingCities.add(city.name),
      );

      while (currentCount < 30 && totalCalls < 5) {
        const countryResponse = await fetch(
          `https://restcountries.com/v3.1/name/${country}`,
        );
        const countryData = await countryResponse.json();
        const countryCode =
          country.toLowerCase() === "china"
            ? "CN"
            : country.toLowerCase() === "united states"
              ? "US"
              : countryData[0].cca2;

        console.log(`coutnry code: ${countryCode}`);
        const countryName =
          country.toLowerCase() === "china"
            ? "China"
            : country.toLowerCase() === "united states"
              ? "United States"
              : countryData[0].name.common;

        const geoDbApiKey =
          "7767b21710mshcd08efc5bb4012ap1f54b7jsndcc3fc53b913";
        const cityResponse = await fetch(
          `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${countryCode}&limit=10&offset=${offset}&minPopulation=20000&types=CITY&sort=-population`,
          {
            method: "GET",
            headers: {
              "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
              "x-rapidapi-key": geoDbApiKey,
            },
          },
        );

        if (!cityResponse.ok) {
          throw new Error(`Error fetching cities: ${cityResponse.status}`);
        }

        const cityData = await cityResponse.json();
        const cities = cityData.data
          .filter(
            (city) =>
              !existingCities.has(city.name) &&
              !city.name.toLowerCase().includes("city"),
          )
          .map((city) => ({
            name: city.name,
            latitude: city.latitude,
            longitude: city.longitude,
            countryName: countryName,
            region: city.region,
            population: city.population,
          }));

        if (cities.length === 0) {
          console.log("No more cities available or all duplicates.");
          break;
        }

        // Add new cities to Firebase
        for (const city of cities) {
          await addDoc(collection(db, "cities"), city);
        }

        currentCount += cities.length;
        totalCalls++;
        setEstimatedTime((5 - totalCalls) * 1);
        offset += 10;
        console.log(`geocities api calls: ${totalCalls}`);
        await new Promise((resolve) => setTimeout(resolve, 1100));
      }

      if (currentCount >= 30) {
        console.log("Enough cities added.");
        const updatedCities = await getCitiesFromFirebase(country);
        displayCities(updatedCities, citiesToBeAdded);
      } else {
        console.log("Reached maximum API calls or no more cities to fetch.");
      }
    } catch (error) {
      console.error("Error fetching or writing cities:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setCitiesToBeAdded(Math.max(4, value));
  };

  const getThumbPosition = () => {
    return (citiesToBeAdded / 30) * sliderWidth - 12;
  };

  const saveRound = async (userId) => {
    if (!isTourCompleted) return;

    try {
      const roundData = {
        country: searchParams.get("country"),
        distance: totalDistance,
        type: "user",
        timestamp: new Date().toISOString(),
        citiesVisited: selectedCities.map((city) => city.name),
      };

      const userRoundsCollection = collection(
        db,
        "rounds",
        userId,
        "userRounds",
      );
      await addDoc(userRoundsCollection, roundData);
      console.log("Round saved successfully");
    } catch (error) {
      console.error("Error saving round:", error);
    }
  };

  const getUserRounds = async (userId) => {
    try {
      const userRoundsCollection = collection(
        db,
        "rounds",
        userId,
        "userRounds",
      );
      const q = query(userRoundsCollection, orderBy("timestamp", "desc"));

      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching user rounds:", error);
      return [];
    }
  };

  return (
    <MapPageContext.Provider
      value={{
        fetchCities,
        handleSliderChange,
        getThumbPosition,
        citiesToBeAdded,
        sliderRef,
        cities,
        loading,
        estimatedTime,
        selectedCities,
        addSelectedCity,
        resetSelectedCities,
        updateTotalDistance,
        totalDistance,
        isTryItYourselfMode,
        toggleTryItYourselfMode,
        isTourCompleted,
        saveRound,
        getUserRounds,
      }}
    >
      {children}
    </MapPageContext.Provider>
  );
};
