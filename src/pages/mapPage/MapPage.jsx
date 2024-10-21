import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Menu, MapPin, Globe, RefreshCcw } from "lucide-react";
import { useMapPageContext } from "./context/MapPageContext";
import { useMapPageTSPContext } from "./context/MapPageTSPContext";
import CountryMap from "./components/CountryMap";
import { useTravelingData } from "../../context/TravelingContext";
import LoadingPopup from "./components/LoadingPopup";
import StepIndicator from "./components/StepIndicator";
import { useTranslation } from "react-i18next";

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const country = searchParams.get("country");
  const { countryCenters, zoomLevels } = useTravelingData();
  const navigate = useNavigate();
  const [isAlgorithmChosen, setIsAlgorithmChosen] = useState(false);
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

  const {
    selectedAlgorithm,
    setSelectedAlgorithm,
    isCalculatingRoute,
    calculateRoute,
    totalDistanceTSP,
    clearTSPRoute,
    isTSPMode,
  } = useMapPageTSPContext();

  const { t } = useTranslation();

  const center = countryCenters[country];
  const zoom =
    zoomLevels[country] *
    (country === "Spain" || country === "Indonesia" || country === "Vietnam"
      ? 1.05
      : 1.1);

  const [mapStep, setMapStep] = useState(0);

  const handleAlgorithmChange = (e) => {
    setSelectedAlgorithm(e.target.value);
  };

  const handleCalculateRoute = () => {
    calculateRoute(cities);
    setIsAlgorithmChosen(true);
  };

  const handleMapStepChange = (step) => {
    if (step !== 2 && isTSPMode) {
      clearTSPRoute();
    }
    setMapStep(step);
  };

  return (
    <div
      className="flex h-screen flex-col bg-egg"
      style={{ touchAction: "pan-y" }}
    >
      <div className="flex-shrink-0">
        <div className="flex items-center justify-between p-4">
          <div className="">
            <button
              onClick={() => {
                navigate("/menu");
              }}
            >
              <ArrowLeft className="text-black" />
            </button>
          </div>
          <div className="text-2xl font-extrabold">{country}</div>
          <div className="w-16"></div>
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
              {isAlgorithmChosen && totalDistanceTSP > 0 && (
                <div
                  className="absolute left-0 right-0 z-10 ml-40 bg-black bg-opacity-50 py-1 text-center font-bold text-white"
                  style={{ top: "368px" }} // Adjust this to control height under the top screen border
                >
                  Distance: {totalDistanceTSP.toFixed(0)} km
                </div>
              )}

              {isTourCompleted && (
                <div
                  className="absolute left-0 right-0 bg-white bg-opacity-50 py-40 text-center font-bold text-white"
                  style={{ top: "0px" }}
                >
                  <p className="mt-3 text-3xl font-bold text-landing2">
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
        {mapStep === 0 && (
          <div className="m-3 bg-gray-50 px-5 pt-12">
            <div className="mb-3 mr-1 flex items-center justify-between">
              <label
                htmlFor="citiesSlider"
                className="text-xl font-light text-gray-600"
              >
                Number to be added:
              </label>
              <span className="text-lg text-landing2">{citiesToBeAdded}</span>
            </div>

            <div className="relative pb-1 pt-14" ref={sliderRef}>
              <div className="absolute left-0 top-0 h-6 w-full rounded-full border border-black"></div>
              <div
                className="absolute left-0 top-0 h-6 rounded-l-full bg-landing2"
                style={{ width: `${(citiesToBeAdded / 30) * 100}%` }}
              ></div>
              <div
                className="absolute top-[-4px] h-8 w-8 rounded-full border-2 border-landing2 bg-white shadow-md"
                style={{ left: `${getThumbPosition()}px` }}
              ></div>
              <input
                className="absolute left-0 top-0 h-6 w-full cursor-pointer opacity-0"
                type="range"
                id="citiesSlider"
                min="4"
                max="30"
                value={citiesToBeAdded}
                onChange={handleSliderChange}
              />

              <button
                className="mt-1 flex w-full items-center justify-center border border-black bg-black px-4 py-3 text-sm font-medium uppercase tracking-wide text-white"
                onClick={() => {
                  fetchCities(country, citiesToBeAdded);
                  setMapStep(1);
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                Add Cities to Map
              </button>
              <div>
                <StepIndicator currentStep={mapStep} />
              </div>
            </div>
          </div>
        )}
        {mapStep === 1 && (
          <div>
            <div className="m-3 flex flex-col items-center bg-gray-50 p-4">
              <div className="mt-10 flex space-x-3">
                <button
                  className={`text-md flex w-full flex-col items-center justify-center px-4 py-3 uppercase shadow-md ${
                    isTryItYourselfMode
                      ? "bg-white text-landing2"
                      : "bg-landing2 text-white"
                  }`}
                  onClick={() => {
                    toggleTryItYourselfMode();
                    setMapStep(3);
                  }}
                >
                  {/* <MousePointerClick className="h-5 w-5" /> */}
                  <span className="font-medium">{t("try_it_yourself")}</span>
                </button>

                <button
                  className="text-md w-full bg-landing2 px-4 py-3 font-medium uppercase text-white shadow-md transition duration-200 hover:bg-white hover:text-landing2"
                  onClick={() => {
                    setMapStep(2);
                  }}
                >
                  Choose algorithm
                </button>
              </div>

              <button
                className="w-18 relative my-3 mr-auto flex items-center border-2 border-landing2 p-1 pr-2 font-medium"
                onClick={() => {
                  setMapStep(mapStep - 1);
                }}
              >
                <ArrowLeft />
                <span className="text-landing-2 mx-auto ml-1 flex-shrink">
                  {t("Back")}
                </span>
              </button>
            </div>
            <div>
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}
        {mapStep === 2 && (
          <div className="mx-8 mt-10 space-y-3">
            <select
              className="w-full border-2 border-gray-200 px-4 py-2 text-gray-700 transition duration-200 focus:border-landing2 focus:outline-none"
              value={selectedAlgorithm}
              onChange={handleAlgorithmChange}
            >
              <option value="alg1">Nearest Neighbor</option>
              <option value="alg2">Greedy</option>
              <option value="alg3">2-Opt</option>
              <option value="alg4">Christofides</option>
            </select>

            <button
              className="w-full bg-landing2 px-4 py-3 font-medium uppercase text-white shadow-md"
              onClick={handleCalculateRoute}
              disable={isCalculatingRoute}
            >
              Choose the algorithm
            </button>

            <button
              onClick={() => {
                handleMapStepChange(mapStep - 1);
                setIsAlgorithmChosen(false);
              }}
              className="w-18 relative my-3 mr-auto mt-8 flex items-center border-2 border-landing2 p-1 pr-2 font-medium"
            >
              <ArrowLeft />
              <span className="text-landing-2 mx-auto ml-1 flex-shrink">
                {t("Back")}
              </span>
            </button>
            <div>
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}
        {mapStep === 3 && (
          <div className="mx-8 mt-10">
            <p className="mb-6">{t("connect_the_cities")}</p>
            <button
              className="w-18 relative mr-auto mt-10 flex border-2 border-landing2 p-1 pr-2 font-medium"
              onClick={() => {
                toggleTryItYourselfMode();
                setMapStep(mapStep - 2);
              }}
            >
              <ArrowLeft />
              <span className="text-landing-2 mx-auto ml-1 flex-shrink">
                {t("Back")}
              </span>
            </button>
            <div>
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
