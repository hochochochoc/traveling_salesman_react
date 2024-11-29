import React, { useState, useEffect } from "react";
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
import { useAuth } from "@/auth/authContext";
import { catalanCountryNames } from "../profilePage/catalanCountryNames/catalanCountryNames";
import ResultsOverlay from "./components/ResultsOverlay";

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const country = searchParams.get("country");
  const { countryCenters, zoomLevels } = useTravelingData();
  const navigate = useNavigate();
  const [showResults, setShowResults] = useState(false);
  const [isAlgorithmChosen, setIsAlgorithmChosen] = useState(false);
  const { currentUser } = useAuth();

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
    saveRound,
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

  const { i18n } = useTranslation();
  const [translatedName, setTranslatedName] = useState(country);

  useEffect(() => {
    const handleAnimationComplete = () => {
      if (isAlgorithmChosen && !showResults) {
        setShowResults(true);
      }
    };

    window.addEventListener("tspAnimationComplete", handleAnimationComplete);
    return () =>
      window.removeEventListener(
        "tspAnimationComplete",
        handleAnimationComplete,
      );
  }, [isAlgorithmChosen, showResults]);

  useEffect(() => {
    if (isTourCompleted) {
      setTimeout(() => {
        setShowResults(true);
      }, 800);
    }
  }, [isTourCompleted]);

  useEffect(() => {
    const translateName = async () => {
      // For Catalan, check our custom list first
      if (i18n.language === "ca" && catalanCountryNames[country]) {
        setTranslatedName(catalanCountryNames[country]);
        return;
      }

      // For Spanish or Catalan without custom translation, use REST Countries API
      if (i18n.language === "es" || i18n.language === "ca") {
        try {
          const response = await fetch(
            `https://restcountries.com/v3.1/name/${country}?fullText=true`,
          );
          const [countryData] = await response.json();
          setTranslatedName(countryData.translations.spa.common);
        } catch (error) {
          setTranslatedName(country); // Fallback to original name
        }
      } else {
        setTranslatedName(country); // For other languages, use original name
      }
    };

    translateName();
  }, [country, i18n.language]);

  const center = countryCenters[country];
  const zoom =
    zoomLevels[country] *
    (country === "Spain" || country === "Indonesia" || country === "Vietnam"
      ? 1.05
      : 1.1);

  const [mapStep, setMapStep] = useState(0);

  useEffect(() => {
    if (isTourCompleted && currentUser) {
      saveRound(currentUser.uid);
    }
  }, [isTourCompleted, currentUser]);

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
        <div className="flex items-center justify-between p-4 md:p-6 md:px-10">
          <div className="">
            <button
              onClick={() => {
                navigate("/menu");
              }}
            >
              <ArrowLeft className="text-white" />
            </button>
          </div>
          <div className="text-2xl font-extrabold text-white">
            {translatedName}
          </div>
          <div className="w-6"></div>
        </div>
        <div className="relative mx-3 h-[25rem] w-auto md:mx-auto md:h-[30rem] md:w-1/2">
          {center && zoom && cities && (
            <>
              <CountryMap
                center={center}
                zoom={zoom}
                country={country}
                cities={cities}
              />
              {isTryItYourselfMode && !showResults && totalDistance > 0 && (
                <div className="absolute bottom-4 right-4 z-10 rounded-lg bg-maps_buttons/80 px-4 py-2 font-bold text-white">
                  {t("distance")} {totalDistance.toFixed(0)} km
                </div>
              )}
              {isAlgorithmChosen && totalDistanceTSP > 0 && !showResults && (
                <div className="absolute bottom-4 right-4 z-10 rounded-lg bg-maps_buttons/80 px-4 py-2 font-bold text-white">
                  {t("distance")} {totalDistanceTSP.toFixed(0)} km
                </div>
              )}

              {isAlgorithmChosen && totalDistanceTSP > 0 && (
                <>
                  {!showResults && (
                    <button
                      onClick={() => setShowResults(true)}
                      className="absolute right-4 top-4 rounded-lg bg-maps_buttons/80 px-4 py-2 text-white"
                    >
                      {t("show_results")}
                    </button>
                  )}
                  <ResultsOverlay
                    visible={showResults}
                    distance={totalDistanceTSP}
                    timeInSeconds={(Math.random() * (0.25 - 0.1) + 0.1).toFixed(
                      3,
                    )}
                    onClose={() => setShowResults(false)}
                  />
                </>
              )}

              {isTourCompleted && (
                <>
                  {!showResults && (
                    <button
                      onClick={() => setShowResults(true)}
                      className="absolute right-4 top-4 rounded-lg bg-maps_buttons/80 px-4 py-2 text-white"
                    >
                      {t("show_results")}
                    </button>
                  )}
                  <ResultsOverlay
                    visible={showResults}
                    distance={totalDistance}
                    timeInSeconds={(Math.random() * (18 - 12) + 12).toFixed(3)}
                    onTryAgain={() => {
                      setMapStep(1);
                      setShowResults(false);
                    }}
                    onClose={() => setShowResults(false)}
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {loading && <LoadingPopup estimatedTime={estimatedTime} />}

      <div className="flex-grow overflow-y-auto">
        {mapStep === 0 && (
          <div className="mx-3 flex min-h-[230px] flex-col md:mx-auto md:min-h-[250px] md:w-1/2">
            <div className="flex flex-col p-2">
              <p className="mb-5 text-lg font-bold text-white md:text-2xl">
                {t("step_1")}
              </p>
              <div className="mb-1 flex items-center justify-between">
                <label
                  htmlFor="citiesSlider"
                  className="mb-2 text-sm text-white md:text-[17px]"
                >
                  {t("number_added")}
                </label>
                <span className="text-sm text-white md:text-[17px]">
                  {citiesToBeAdded}
                </span>
              </div>

              <div className="relative pb-1 pt-8" ref={sliderRef}>
                <div className="absolute left-0 top-0 h-6 w-full rounded-full border border-landing3"></div>
                <div
                  className="absolute left-0 top-0 h-6 rounded-l-full bg-landing3"
                  style={{
                    width: `${Math.max((citiesToBeAdded / 30) * 100, (4 / 30) * 100)}%`,
                  }}
                ></div>
                <div
                  className="absolute top-[-4px] h-8 w-8 rounded-full border-2 border-landing3 bg-white shadow-md"
                  style={{ left: `${getThumbPosition()}px` }}
                ></div>
                <input
                  className="absolute left-0 top-0 h-4 w-full cursor-pointer opacity-0"
                  type="range"
                  id="citiesSlider"
                  min="0"
                  max="30"
                  value={citiesToBeAdded}
                  onChange={handleSliderChange}
                />
              </div>

              <button
                className="text-md mx-auto mt-2 flex items-center rounded-full border border-gray-500 bg-maps_buttons px-3 py-1.5 text-white md:text-[17px]"
                onClick={() => {
                  fetchCities(country, citiesToBeAdded);
                  setMapStep(1);
                }}
              >
                <MapPin className="mr-1 inline h-4 w-4 flex-shrink-0 md:h-5 md:w-5" />
                {t("add_to_map")}
              </button>
            </div>

            <div className="mt-auto px-2 pb-2">
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}

        {mapStep === 1 && (
          <div className="mx-3 flex min-h-[230px] flex-col md:mx-auto md:min-h-[250px] md:w-1/2">
            <div className="p-2">
              <p className="mb-5 text-lg font-bold text-white md:text-2xl">
                {t("step_2")}
              </p>
              <div className="flex gap-2 md:gap-6">
                <button
                  className="text-md flex-1 rounded-lg border border-gray-500 bg-maps_buttons p-2 text-white md:mt-2 md:p-3"
                  onClick={() => {
                    toggleTryItYourselfMode();
                    setMapStep(3);
                  }}
                >
                  <MousePointerClick className="mb-1 h-6 w-6 rounded-lg border bg-gradient-to-br from-teal-400 to-blue-500 p-1 md:h-7 md:w-7" />
                  <div className="flex items-center justify-between">
                    <span className="mr-8 text-start md:text-[17px]">
                      {t("try_it_yourself")}
                    </span>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 md:h-5 md:w-5" />
                  </div>
                </button>

                <button
                  className="flex-1 rounded-lg border border-gray-500 bg-maps_buttons p-2 text-white md:mt-2 md:p-3"
                  onClick={() => setMapStep(2)}
                >
                  <Cpu className="mb-1 h-6 w-6 rounded-lg border bg-landing3 bg-gradient-to-br from-blue-500 to-landing2 p-1 md:h-7 md:w-7" />
                  <div className="flex items-center justify-between">
                    <span className="mr-2 text-start md:text-[17px]">
                      {t("choose_algorithm")}
                    </span>
                    <ArrowRight className="h-4 w-4 flex-shrink-0 md:h-5 md:w-5" />
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-auto px-2 pb-2">
              <button
                className="mb-2 flex items-center rounded-lg border border-gray-500 bg-landing2 px-2 py-1 text-sm text-white"
                onClick={() => setMapStep(mapStep - 1)}
              >
                <ArrowLeft className="my-auto h-3 w-3 md:h-4 md:w-4" />
                <span className="ml-1 md:text-[16px]">{t("Back")}</span>
              </button>
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}

        {mapStep === 2 && (
          <div className="mx-3 flex min-h-[230px] flex-col md:mx-auto md:min-h-[250px] md:w-1/2">
            <div className="flex flex-col p-2">
              <p className="mb-8 text-lg font-bold text-white md:mb-6 md:text-2xl">
                {t("step_3_algorithm")}
              </p>

              <select
                className="text-md mx-auto mb-3 rounded-lg border border-gray-500 px-2 py-1 text-gray-700 md:mb-6 md:mt-2 md:text-[18px]"
                value={selectedAlgorithm}
                onChange={handleAlgorithmChange}
              >
                <option value="alg1">{t("nearest_neighbor")}</option>
                <option value="alg2">{t("greedy")}</option>
                <option value="alg3">2-Opt</option>
                <option value="alg4">Christofides</option>
              </select>

              <button
                className="text-md mx-auto rounded-full border border-gray-500 bg-maps_buttons px-3 py-1.5 text-white md:text-[17px]"
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
                <ArrowLeft className="my-auto h-3 w-3 md:h-4 md:w-4" />
                <span className="ml-1 md:text-[16px]">{t("Back")}</span>
              </button>
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}

        {mapStep === 3 && (
          <div className="mx-3 flex min-h-[230px] flex-col md:mx-auto md:min-h-[250px] md:w-1/2">
            <div className="p-2">
              <p className="mb-5 text-lg font-bold text-white md:text-2xl">
                {t("step_3_diy")}
              </p>
              <p className="text-md text-white">{t("connect_the_cities")}</p>
            </div>

            <div className="mt-auto px-2 pb-2">
              <button
                className="mb-2 flex items-center rounded-lg border border-gray-500 bg-landing2 px-2 py-1 text-sm text-white"
                onClick={() => {
                  toggleTryItYourselfMode();
                  setMapStep(mapStep - 2);
                }}
              >
                <ArrowLeft className="my-auto h-3 w-3 md:h-4 md:w-4" />
                <span className="ml-1 md:text-[16px]">{t("Back")}</span>
              </button>
              <StepIndicator currentStep={mapStep} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
