import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, MapPin } from "lucide-react";
import { MousePointerClick, Globe, RefreshCcw } from "lucide-react";

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const country = searchParams.get("country");
  const [citiesToBeAdded, setCitiesToBeAdded] = useState(3);
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sliderWidth, setSliderWidth] = useState(0);
  const sliderRef = useRef(null);

  useEffect(() => {
    // Update the slider width when the component mounts or when ref is updated
    if (sliderRef.current) {
      setSliderWidth(sliderRef.current.offsetWidth);
    }
  }, []);

  const fetchCities = async (country, citiesToBeAdded) => {
    try {
      // Step 1: Fetch the cca2 code using Rest Countries API
      const countryResponse = await fetch(
        `https://restcountries.com/v3.1/name/${country}`,
      );

      if (!countryResponse.ok) {
        throw new Error(`Country fetch failed: ${countryResponse.status}`);
      }

      const countryData = await countryResponse.json();
      const countryCode = countryData[0].cca2; // Get the cca2 code
      const countryName = countryData[0].name.common; // Get the common country name

      // Step 2: Fetch the cities using GeoDB Cities API and the cca2 country code
      const geoDbApiKey = "7767b21710mshcd08efc5bb4012ap1f54b7jsndcc3fc53b913"; // Use your GeoDB API key here

      const cityResponse = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${countryCode}&limit=${citiesToBeAdded}&minPopulation=40000&types=CITY&sort=-population`,
        {
          method: "GET",
          headers: {
            "x-rapidapi-host": "wft-geo-db.p.rapidapi.com",
            "x-rapidapi-key": geoDbApiKey,
          },
        },
      );

      if (!cityResponse.ok) {
        throw new Error(`Cities fetch failed: ${cityResponse.status}`);
      }

      const cityData = await cityResponse.json();
      const cities = cityData.data.map((city) => ({
        name: city.name,
        latitude: city.latitude,
        longitude: city.longitude,
        countryName: countryName,
        region: city.region,
        population: city.population,
      }));

      // Send data to the backend to write to CSV
      const response = await fetch("http://localhost:5000/api/write-cities", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cities }),
      });

      if (!response.ok) {
        throw new Error("Failed to write to CSV");
      }

      console.log("Cities data written to CSV");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

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
