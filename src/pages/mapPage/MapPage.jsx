import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  MousePointerClick,
  ArrowRight,
  Cpu,
} from "lucide-react";
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
              <ArrowLeft className="text-white" />
            </button>
          </div>
          <div className="text-2xl font-extrabold text-white">{country}</div>
          <div className="w-6"></div>
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
                  className="absolute left-0 right-0 bg-opacity-50 py-40 text-center font-bold text-white"
                  style={{ top: "0px" }}
                >
                  <p className="mt-3 text-3xl font-bold text-landing2">
                    Tour Completed!
                  </p>
                  <p className="mt-1 text-lg text-gray-500">
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
          <div className="m-3 p-4">
            <p className="text-lg font-bold text-white">{t("step_1")}</p>
            <div className="mb-3 mr-1 flex items-center justify-between">
              <label
                htmlFor="citiesSlider"
                className="text-xl font-light text-white"
              >
                Number to be added:
              </label>
              <span className="text-lg text-white">{citiesToBeAdded}</span>
            </div>

            <div className="relative pb-1 pt-14" ref={sliderRef}>
              <div className="absolute left-0 top-0 h-6 w-full rounded-full border border-landing3"></div>
              <div
                className="absolute left-0 top-0 h-6 rounded-l-full bg-landing3"
                style={{ width: `${(citiesToBeAdded / 30) * 100}%` }}
              ></div>
              <div
                className="absolute top-[-4px] h-8 w-8 rounded-full border-2 border-landing3 bg-white shadow-md"
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
                className="mt-1 flex w-full items-center justify-center rounded-lg border border-gray-500 bg-landing2 px-4 py-3 text-sm font-medium tracking-wide text-white"
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
            <div className="mx-3 mt-3 flex flex-col items-center px-4 pt-4">
              <p className="mr-auto text-lg font-bold text-white">
                {t("step_2")}
              </p>
              <div className="mt-4 flex space-x-3">
                <button
                  className="text-md flex w-full flex-col items-start justify-center space-y-1 rounded-lg border border-gray-500 bg-landing2 px-4 py-3 text-white shadow-md"
                  onClick={() => {
                    toggleTryItYourselfMode();
                    setMapStep(3);
                  }}
                >
                  <MousePointerClick className="h-8 w-8 rounded-xl border border-landing3 bg-landing3 p-1" />
                  <div className="flex items-center justify-between space-x-3">
                    <span className="text-start text-sm font-medium">
                      {t("try_it_yourself")}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </button>

                <button
                  className="text-md flex w-full flex-col items-start justify-center space-y-1 rounded-lg border border-gray-500 bg-landing2 px-4 py-3 text-white shadow-md"
                  onClick={() => {
                    setMapStep(2);
                  }}
                >
                  <Cpu className="h-8 w-8 rounded-xl border border-landing3 bg-landing3 p-1" />
                  <div className="flex items-center justify-between space-x-3">
                    <span className="text-start text-sm font-medium">
                      {t("choose_algorithm")}
                    </span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </button>
              </div>

              <button
                className="relative my-3 mr-auto flex w-36 items-center rounded-lg border border-gray-500 bg-landing2 p-1 pr-2 font-medium text-white"
                onClick={() => {
                  setMapStep(mapStep - 1);
                }}
              >
                <ArrowLeft className="ml-1 h-4 w-4" />
                <span className="text-landing-2 mx-auto ml-2 flex-shrink">
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
          <div className="m-3 space-y-3 p-4">
            <p className="text-lg font-bold text-white">
              {t("step_3_algorithm")}
            </p>

            <select
              className="w-full rounded-lg border border-gray-500 px-4 py-2 text-gray-700"
              value={selectedAlgorithm}
              onChange={handleAlgorithmChange}
            >
              <option value="alg1">Nearest Neighbor Method</option>
              <option value="alg2">Greedy Heuristic</option>
              <option value="alg3">2-Opt</option>
              <option value="alg4">Christofides</option>
            </select>

            <button
              className="w-full rounded-lg border border-gray-500 bg-landing2 px-4 py-3 font-medium text-white shadow-md"
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
              className="relative my-3 mr-auto mt-8 flex w-36 items-center rounded-lg border border-gray-500 bg-landing2 p-1 pr-2 font-medium"
            >
              <ArrowLeft className="ml-1 h-4 w-4 text-white" />
              <span className="text-landing-2 mx-auto ml-2 flex-shrink text-white">
                {t("Back")}
              </span>
            </button>
            <div>
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}
        {mapStep === 3 && (
          <div className="m-3 p-4 text-white">
            <p className="text-lg font-bold text-white">{t("step_3_diy")}</p>

            <p className="mb-6">{t("connect_the_cities")}</p>
            <button
              className="relative my-3 mr-auto mt-8 flex w-36 items-center rounded-lg border border-gray-500 bg-landing2 p-1 pr-2 font-medium"
              onClick={() => {
                toggleTryItYourselfMode();
                setMapStep(mapStep - 2);
              }}
            >
              <ArrowLeft className="ml-1 h-4 w-4" />
              <span className="text-landing-2 mx-auto ml-2 flex-shrink">
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
