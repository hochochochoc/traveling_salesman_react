import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Menu,
  MapPin,
  MousePointerClick,
  Globe,
  RefreshCcw,
} from "lucide-react";
import { useMapPageContext } from "./context/MapPageContext";
import CountryMap from "./components/CountryMap";
import { useTravelingData } from "../../context/TravelingContext";
import LoadingPopup from "./components/LoadingPopup";

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const country = searchParams.get("country");
  const { countryCenters, zoomLevels } = useTravelingData();
  const navigate = useNavigate();
  const {
    fetchCities,
    handleSliderChange,
    getThumbPosition,
    citiesToBeAdded,
    sliderRef,
    loading,
    estimatedTime,
    cities,
    totalDistance,
    isTryItYourselfMode,
    toggleTryItYourselfMode,
    isTourCompleted,
  } = useMapPageContext();

  const center = countryCenters[country];
  const zoom = zoomLevels[country] * (country === "Spain" ? 1.2 : 1.4);

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
                navigate("/menu");
              }}
            >
              <ArrowLeft className="text-black" />
            </button>
          </div>
          <div className="text-lg font-extrabold">{country}</div>
          <button
            onClick={() => {
              // Logout logic
              navigate("/menu");
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
        <div className="relative mx-3 h-[25rem] w-auto">
          {center && zoom && cities && (
            <>
              <CountryMap
                center={center}
                zoom={zoom}
                country={country}
                cities={cities}
              />
              {isTryItYourselfMode && !isTourCompleted && totalDistance > 0 && (
                <div
                  className="absolute left-0 right-0 z-10 ml-40 bg-black bg-opacity-50 py-1 text-center font-bold text-white"
                  style={{ top: "368px" }} // Adjust this to control height under the top screen border
                >
                  Distance: {totalDistance.toFixed(0)} km
                </div>
              )}
              {isTourCompleted && (
                <div
                  className="absolute left-0 right-0 bg-white bg-opacity-50 py-40 text-center font-bold text-white"
                  style={{ top: "0px" }}
                >
                  <p className="mt-3 text-3xl font-bold text-green-600">
                    Tour Completed!
                  </p>
                  <p className="mt-1 text-lg text-black">
                    Total distance: {totalDistance.toFixed(0)} km
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {loading && <LoadingPopup estimatedTime={estimatedTime} />}

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
          <button
            className={`flex w-full items-center justify-center space-x-3 rounded-xl px-4 py-3 text-white shadow-md transition duration-200 ${
              isTryItYourselfMode
                ? "bg-red-500 hover:bg-red-600"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            onClick={toggleTryItYourselfMode}
          >
            <MousePointerClick className="h-5 w-5" />
            <span className="font-medium">
              {isTryItYourselfMode ? "Exit Try It Yourself" : "Try It Yourself"}
            </span>
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
        {/* <div className="h-10 bg-mapsblue"></div> */}
      </div>
    </div>
  );
}
