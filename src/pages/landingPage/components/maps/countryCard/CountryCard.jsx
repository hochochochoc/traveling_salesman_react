import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MapTest from "../../maptest/MapTest";
import { useTranslation } from "react-i18next";
import { catalanCountryNames } from "@/pages/profilePage/catalanCountryNames/catalanCountryNames";

const CountryCard = ({
  country,
  index,
  isFlipped,
  onFlip,
  countryCenters,
  zoomLevels,
  countryFlags,
  countryAreas,
  userLoggedIn,
}) => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [translatedName, setTranslatedName] = useState(country);

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

  const handleManualFlip = () => {
    onFlip(index);
  };

  const handleNavigate = () => {
    if (
      !userLoggedIn &&
      country !== "Brazil" &&
      country !== "Spain" &&
      country !== "Egypt" &&
      country !== "Vietnam" &&
      country !== "Bangladesh" &&
      country !== "Egypt"
    ) {
      return;
    }
    navigate(`/map?country=${country}`);
  };

  return (
    <div
      className="mb-3 mt-1"
      style={{
        perspective: "1000px",
        width: "300px",
        height: "400px",
        cursor: "pointer",
      }}
    >
      <div
        className="duration-6000 relative h-full w-full transition-transform"
        style={{
          transition: "transform 0.6s",
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "",
        }}
      >
        <div
          className="backface-hidden absolute flex h-full w-full items-center justify-center border border-black bg-white"
          onClick={handleManualFlip}
        >
          <img
            className="h-full w-full object-cover p-2 shadow-lg"
            src={`/countryImages/${country}.jpg?height=380&width=280`}
            alt={country}
          />
        </div>
        <div
          className="relative flex h-full w-full items-center justify-center bg-landing3 shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
          onClick={handleNavigate}
        >
          {!userLoggedIn &&
          country !== "Brazil" &&
          country !== "Spain" &&
          country !== "Egypt" &&
          country !== "Vietnam" &&
          country !== "Bangladesh" ? (
            <div className="text-md m-2 flex h-[384px] w-full flex-col items-center justify-center border border-red-800 py-6 text-center text-red-500">
              <p>Access to this country is restricted.</p>
              <p>Please log in to unlock and explore.</p>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col border border-black">
              {countryCenters[country] && (
                <MapTest
                  center={countryCenters[country]}
                  zoom={zoomLevels[country]}
                  className="flex-grow"
                />
              )}
              <div className="w-full border-t border-black bg-landing3 pl-3">
                <div className="flex justify-between">
                  <h3 className="text-2xl font-bold text-white">
                    {translatedName}
                  </h3>
                  <div className="mx-2 self-center shadow-lg">
                    <img
                      src={countryFlags[country]}
                      alt={`${country} flag`}
                      className="h-5 w-auto rounded-sm border border-white"
                    />
                  </div>
                </div>
                <p className="mt-1 text-sm text-white">
                  {countryAreas[country]} km²
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CountryCard;
