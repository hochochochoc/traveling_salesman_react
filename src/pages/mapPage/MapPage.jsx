import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, MapPin } from "lucide-react";
import { MousePointerClick, Globe, RefreshCcw } from "lucide-react";
import { db } from "../../../firebaseConfig";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const country = searchParams.get("country");
  const [citiesToBeAdded, setCitiesToBeAdded] = useState(3);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }
  }, []);

  const fetchCities = async (country, citiesToBeAdded) => {
    const citiesFromFirebase = await getCitiesFromFirebase(country);

    if (citiesFromFirebase.length >= 30) {
      displayCities(citiesFromFirebase, citiesToBeAdded);
    } else {
      await addNewCities(country, citiesFromFirebase.length, citiesToBeAdded);
    }
  };

  // 1. Function to read cities from Firebase for the given country
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

  // 2. Function to display cities
  const displayCities = (cities, citiesToBeAdded) => {
    const shuffledCities = cities.sort(() => 0.5 - Math.random());
    const selectedCities = shuffledCities.slice(0, citiesToBeAdded);
    const cityParagraphs = selectedCities
      .map((city) => `<p>${city.name}</p>`)
      .join("");

    const cityContainer = document.querySelector(".h-80.bg-mapsblue");
    if (cityContainer) {
      cityContainer.innerHTML = cityParagraphs;
    } else {
      console.error("City container not found.");
    }
  };

  // 3. Function to fetch new cities and add them to Firebase
  const addNewCities = async (country, currentCount, citiesToBeAdded) => {
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
    }
  };

  //
  //
  // Handle slider changes correctly
  const handleSliderChange = (event) => {
    setCitiesToBeAdded(parseInt(event.target.value, 10));
  };

  // Calculate the thumb's left position based on the percentage
  const getThumbPosition = () => {
    return ((citiesToBeAdded - 1) / 29) * (sliderWidth - 20);
  };

  return (
    <div
      className="flex h-screen flex-col bg-tertiary"
      style={{ touchAction: "pan-y" }}
    >
      <div className="flex-shrink-0">
        <div className="flex justify-between p-4">
          <div className="flex items-center">
            <button
              onClick={() => {
                navigate("/");
              }}
            >
              <ArrowLeft className="text-black" />
            </button>
          </div>
          <div className="text-lg font-extrabold">{country}</div>
          <button
            onClick={() => {
              // Logout logic
              navigate("/");
            }}
            className="ml-12 flex max-h-9 justify-center rounded-lg border border-black px-2 hover:bg-gray-200 active:scale-95"
          >
            Logout
          </button>
          <Menu
            className="cursor-pointer"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          />
        </div>
        <div className="h-80 bg-mapsblue"></div>
        <div className="h-20 bg-mapsblue"></div>
      </div>

      <div className="flex-grow overflow-y-auto">
        <div className="m-3 rounded-lg bg-gray-50 p-3">
          <div className="mb-2 mr-1 flex items-center justify-between">
            <label
              htmlFor="citiesSlider"
              className="text-sm font-light text-gray-600"
            >
              Number to be added:
            </label>
            <span className="text-lg font-light text-mapsblue">
              {citiesToBeAdded}
            </span>
          </div>

          <div className="relative pb-1 pt-3" ref={sliderRef}>
            <div className="absolute left-0 top-0 h-4 w-full rounded-full bg-gradient-to-br from-blue-50 to-blue-200"></div>
            <div
              className="absolute left-0 top-0 h-4 rounded-l-full bg-blue-300"
              style={{ width: `${(citiesToBeAdded / 30) * 100}%` }}
            ></div>
            <div
              className="absolute top-[-4px] h-6 w-6 rounded-full border-2 border-blue-400 bg-white shadow-md"
              style={{ left: `${getThumbPosition()}px` }}
            ></div>
            <input
              type="range"
              id="citiesSlider"
              min="1"
              max="30"
              value={citiesToBeAdded}
              onChange={handleSliderChange}
              className="absolute left-0 top-0 h-4 w-full cursor-pointer opacity-0"
            />
            <div className="flex justify-center">
              <button
                onClick={() => fetchCities(country, citiesToBeAdded)}
                className="mt-4 flex w-max items-center justify-center rounded-full bg-blue-500 px-3 py-2 font-light text-white transition-colors duration-200"
              >
                <MapPin className="mr-2 h-4 w-4" />
                Add Cities to Map
              </button>
            </div>
          </div>
        </div>

        <div className="m-3 flex flex-col items-center rounded-lg bg-gray-50 p-4">
          <button className="flex w-full items-center justify-center space-x-3 rounded-xl bg-blue-500 px-4 py-3 text-white shadow-md transition duration-200 hover:bg-blue-600">
            <MousePointerClick className="h-5 w-5" />
            <span className="font-medium">Try it yourself</span>
          </button>

          <div className="relative my-3 flex w-full items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 flex-shrink text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="space-y-3">
            <select className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-700 transition duration-200 focus:border-blue-500 focus:outline-none">
              <option value="alg1">Algorithm 1</option>
              <option value="alg2">Algorithm 2</option>
              <option value="alg3">Algorithm 3</option>
            </select>

            <button className="w-full rounded-xl bg-blue-500 px-4 py-3 font-medium text-white shadow-md transition duration-200 hover:bg-blue-600">
              Choose an algorithm
            </button>
          </div>
        </div>

        <div className="m-3 flex items-center justify-around space-x-2 rounded-lg bg-gray-50 p-4">
          <button className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-gray-100 px-2 py-3 font-medium text-gray-700 shadow-md transition duration-200 hover:bg-gray-200">
            <RefreshCcw className="h-5 w-5" />
            <span className="text-xs">Reset</span>
          </button>
          <button className="flex flex-1 items-center justify-center space-x-2 rounded-xl bg-gray-100 px-2 py-3 font-medium text-gray-700 shadow-md transition duration-200 hover:bg-gray-200">
            <Globe className="h-5 w-5" />
            <span className="text-xs">Change Country</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// TODO:
// why cities not working for e.g. Spain? something wrong with cities count, increase limit to 10?
// edge case china/taipei
// when it can't load enough cities it should just say so.
// I only want to add the cities once, or at least just replace the current ones on repeat click
