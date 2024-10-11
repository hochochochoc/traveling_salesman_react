import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import { db } from "../../../../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

const MapPageContext = createContext();

export const useMapPageContext = () => {
  return useContext(MapPageContext);
};

export const MapPageProvider = ({ children }) => {
  const [citiesToBeAdded, setCitiesToBeAdded] = useState(3);
  const sliderRef = useRef(null);
  const [sliderWidth, setSliderWidth] = useState(0);
  const [loading, setLoading] = useState(false);
  const [estimatedTime, setEstimatedTime] = useState(0);

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }
  }, []);

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
    const cityParagraphs = selectedCities
      .map(
        (city) =>
          `<p>${city.name} (Lat: ${city.latitude}, Lng: ${city.longitude})</p>`,
      )
      .join("");

    const cityContainer = document.querySelector(".h-10.bg-mapsblue");
    if (cityContainer) {
      cityContainer.innerHTML = cityParagraphs;
    } else {
      console.error("City container not found.");
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
        const countryCode = countryData[0].cca2;
        const countryName = countryData[0].name.common;

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
    setCitiesToBeAdded(parseInt(event.target.value, 10));
  };

  const getThumbPosition = () => {
    return ((citiesToBeAdded - 1) / 29) * (sliderWidth - 20);
  };

  return (
    <MapPageContext.Provider
      value={{
        fetchCities,
        handleSliderChange,
        getThumbPosition,
        citiesToBeAdded,
        sliderRef,
        loading,
        estimatedTime,
      }}
    >
      {children}
    </MapPageContext.Provider>
  );
};
