import React, { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, MapPin } from "lucide-react";
import { MousePointerClick } from "lucide-react";

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

  useEffect(() => {
    if (country) {
      fetchCities(country);
    }
  }, [country]);

  const fetchCities = async (country) => {
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

      // Step 2: Fetch the cities using the country code
      const cityResponse = await fetch(
        `http://api.geonames.org/searchJSON?country=${countryCode}&minPopulation=10000&maxRows=20&username=hochochoc`,
      );

      if (!cityResponse.ok) {
        throw new Error(`Cities fetch failed: ${cityResponse.status}`);
      }

      const cityData = await cityResponse.json();
      const cities = cityData.geonames;
      console.log("Cities:", cities);
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
              <button className="mt-4 flex w-max items-center justify-center rounded-full bg-blue-400 px-3 py-2 font-light text-white transition-colors duration-200">
                <MapPin className="mr-2 h-4 w-4" />
                Add Cities to Map
              </button>
            </div>
          </div>
        </div>

        <div className="m-3 flex items-center rounded-lg bg-gray-50 p-4">
          <button className="flex flex-col items-center rounded-lg bg-blue-400 px-3 py-2 text-white">
            <div className="flex items-center space-x-1">
              <MousePointerClick />
              <span>Try it yourself</span>
            </div>
          </button>
          <div className="ml-16">OR</div>
        </div>

        <div className="m-3 flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div className="flex flex-row items-center justify-center space-x-2 space-y-2">
            <select className="rounded-lg border border-gray-300 py-1 pl-2 pr-8">
              <option value="alg1">Algorithm 1</option>
              <option value="alg2">Algorithm 2</option>
              <option value="alg3">Algorithm 3</option>
            </select>

            <button className="rounded-lg bg-blue-400 px-2 py-2 text-white">
              Choose algorithm
            </button>
          </div>
        </div>

        <div className="m-3 flex items-center justify-around space-x-2 rounded-lg bg-gray-50 p-4">
          <button className="rounded-lg bg-blue-400 px-2 py-2 text-white">
            Reset
          </button>
          <button className="rounded-lg bg-blue-400 px-2 py-2 text-white">
            Change Country
          </button>
        </div>
      </div>
    </div>
  );
}
