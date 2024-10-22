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
          <div className="mx-3 flex min-h-[200px] flex-col">
            <div className="flex flex-col p-2">
              <p className="mb-2 text-lg font-bold text-white">{t("step_1")}</p>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="citiesSlider"
                  className="mb-2 text-sm text-white"
                >
                  {t("number_added")}
                </label>
                <span className="text-sm text-white">{citiesToBeAdded}</span>
              </div>

              <div className="relative pb-1 pt-8" ref={sliderRef}>
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
                  className="absolute left-0 top-0 h-4 w-full cursor-pointer opacity-0"
                  type="range"
                  id="citiesSlider"
                  min="4"
                  max="30"
                  value={citiesToBeAdded}
                  onChange={handleSliderChange}
                />
              </div>

              <button
                className="mx-auto mt-2 rounded-full border border-gray-500 bg-landing2 px-3 py-1.5 text-sm text-white"
                onClick={() => {
                  fetchCities(country, citiesToBeAdded);
                  setMapStep(1);
                }}
              >
                <MapPin className="mr-1 inline h-3 w-3" />
                {t("add_to_map")}
              </button>
            </div>

            <div className="mt-auto px-2 pb-2">
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}

        {mapStep === 1 && (
          <div className="mx-3 flex min-h-[200px] flex-col">
            <div className="p-2">
              <p className="mb-2 text-lg font-bold text-white">{t("step_2")}</p>
              <div className="flex gap-2">
                <button
                  className="flex-1 rounded-lg border border-gray-500 bg-landing2 p-2 text-sm text-white"
                  onClick={() => {
                    toggleTryItYourselfMode();
                    setMapStep(3);
                  }}
                >
                  <MousePointerClick className="mb-1 h-6 w-6 rounded-lg border border-landing3 bg-landing3 p-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-start text-sm">
                      {t("try_it_yourself")}
                    </span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>

                <button
                  className="flex-1 rounded-lg border border-gray-500 bg-landing2 p-2 text-sm text-white"
                  onClick={() => setMapStep(2)}
                >
                  <Cpu className="mb-1 h-6 w-6 rounded-lg border border-landing3 bg-landing3 p-1" />
                  <div className="flex items-center justify-between">
                    <span className="text-start text-sm">
                      {t("choose_algorithm")}
                    </span>
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-auto px-2 pb-2">
              <button
                className="mb-2 flex items-center rounded-lg border border-gray-500 bg-landing2 px-2 py-1 text-sm text-white"
                onClick={() => setMapStep(mapStep - 1)}
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="ml-1">{t("Back")}</span>
              </button>
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}

        {mapStep === 2 && (
          <div className="mx-3 flex min-h-[200px] flex-col">
            <div className="flex flex-col p-2">
              <p className="mb-2 text-lg font-bold text-white">
                {t("step_3_algorithm")}
              </p>

              <select
                className="mx-auto mb-2 rounded-lg border border-gray-500 px-2 py-1 text-sm text-gray-700"
                value={selectedAlgorithm}
                onChange={handleAlgorithmChange}
              >
                <option value="alg1">{t("nearest_neighbor")}</option>
                <option value="alg2">{t("greedy")}</option>
                <option value="alg3">2-Opt</option>
                <option value="alg4">Christofides</option>
              </select>

              <button
                className="mx-auto rounded-full border border-gray-500 bg-landing2 px-3 py-1.5 text-sm text-white"
                onClick={handleCalculateRoute}
                disabled={isCalculatingRoute}
              >
                {t("calculate")}
              </button>
            </div>

            <div className="mt-auto px-2 pb-2">
              <button
                onClick={() => {
                  handleMapStepChange(mapStep - 1);
                  setIsAlgorithmChosen(false);
                }}
                className="mb-2 flex items-center rounded-lg border border-gray-500 bg-landing2 px-2 py-1 text-sm text-white"
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="ml-1">{t("Back")}</span>
              </button>
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}

        {mapStep === 3 && (
          <div className="mx-3 flex min-h-[200px] flex-col">
            <div className="p-2">
              <p className="mb-2 text-lg font-bold text-white">
                {t("step_3_diy")}
              </p>
              <p className="text-sm text-white">{t("connect_the_cities")}</p>
            </div>

            <div className="mt-auto px-2 pb-2">
              <button
                className="mb-2 flex items-center rounded-lg border border-gray-500 bg-landing2 px-2 py-1 text-sm text-white"
                onClick={() => {
                  toggleTryItYourselfMode();
                  setMapStep(mapStep - 2);
                }}
              >
                <ArrowLeft className="h-3 w-3" />
                <span className="ml-1">{t("Back")}</span>
              </button>
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
