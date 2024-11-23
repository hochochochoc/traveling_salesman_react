import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTravelingData } from "../../../../context/TravelingContext";
import { useAuth } from "../../../../auth/authContext";
import CountryCard from "./countryCard/CountryCard";
import Searchbar from "./searchbar/Searchbar";
import { useTranslation } from "react-i18next";

export default function CountryMapsCarousel() {
  const {
    countryCenters,
    zoomLevels,
    countryFlags,
    countryAreas,
    selectedCountries,
    loading,
    setNewCountries,
  } = useTravelingData();
  const carouselRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [slidePosition, setSlidePosition] = useState(1);
  const [cardWidth, setCardWidth] = useState(220);
  const [isAutoFlipping, setIsAutoFlipping] = useState(true);
  const [isAllFlipped, setIsAllFlipped] = useState(false);
  const [countryNames, setCountryNames] = useState(selectedCountries);
  const { userLoggedIn } = useAuth();
  const { t } = useTranslation();

  // Initialize cards with alternating faces
  const shouldShowFront = (index) => index % 2 === 0;

  const handleSearch = async (searchTerm) => {
    let formattedCountries;
    let success = true;

    if (Array.isArray(searchTerm)) {
      const countriesToFetch = searchTerm.filter(
        (country) =>
          !selectedCountries.includes(country) && !countryCenters[country],
      );

      if (countriesToFetch.length > 0) {
        const results = await Promise.all(
          countriesToFetch.map((country) => setNewCountries(country)),
        );
        success = results.every((result) => result === true);
      }

      formattedCountries = success ? searchTerm : selectedCountries;
    } else if (searchTerm) {
      const formattedCountry = searchTerm
        .split(/[\s-]+/)
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
        )
        .join(" ")
        .replace(/\s-\s/g, "-");

      if (!selectedCountries.includes(formattedCountry)) {
        success = await setNewCountries(formattedCountry);
      }

      formattedCountries = success ? [formattedCountry] : selectedCountries;
    } else {
      formattedCountries = selectedCountries;
    }

    if (success) {
      setCountryNames(formattedCountries);
      setSlidePosition(0);
      setIsAllFlipped(false);
      setIsAutoFlipping(true);
    }
  };

  const flipAllCards = useCallback(() => {
    if (isAutoFlipping) {
      setIsAllFlipped((prev) => !prev);
    }
  }, [isAutoFlipping]);

  useEffect(() => {
    const flipInterval = setInterval(flipAllCards, 7000);
    return () => clearInterval(flipInterval);
  }, [flipAllCards]);

  const handleManualFlip = () => {
    setIsAllFlipped((prev) => !prev);
    setIsAutoFlipping(false);

    // Resume auto-flipping after a delay
    setTimeout(() => {
      setIsAutoFlipping(true);
    }, 600);
  };

  // Touch handling setup
  useEffect(() => {
    const carousel = carouselRef.current;
    const singleCard = carousel?.querySelector(".card");
    if (singleCard) {
      setCardWidth(singleCard.offsetWidth);
    }
  }, [countryNames.length, countryCenters, zoomLevels]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || cardWidth === 0) return;

    const handleTouchStart = (e) => {
      setStartX(e.touches[0].clientX);
      setIsSwiping(true);
    };

    const handleTouchMove = (e) => {
      if (!isSwiping) return;

      const x = e.touches[0].clientX;
      const diff = (startX - x) * 1.5;
      let newPosition = slidePosition - diff;

      const maxPosition = -(
        countryNames.length * (cardWidth + 12) -
        carousel.offsetWidth +
        12
      );

      newPosition = Math.max(Math.min(newPosition, 0), maxPosition);

      setSlidePosition(newPosition);
      setStartX(x);
    };

    const handleTouchEnd = () => {
      setIsSwiping(false);
    };

    carousel.addEventListener("touchstart", handleTouchStart);
    carousel.addEventListener("touchmove", handleTouchMove);
    carousel.addEventListener("touchend", handleTouchEnd);

    return () => {
      carousel.removeEventListener("touchstart", handleTouchStart);
      carousel.removeEventListener("touchmove", handleTouchMove);
      carousel.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isSwiping, startX, slidePosition, cardWidth]);

  // Check if all country data is loaded
  const allDataLoaded = countryNames.every(
    (country) =>
      countryCenters[country] && zoomLevels[country] && countryFlags[country],
  );

  return (
    <div className="md:mx-auto">
      <div className="px-8 py-2 text-white">
        <div className="text-2xl font-bold uppercase md:mt-6 md:text-center md:text-3xl">
          {t("Chooseacountry")}
        </div>
        <div className="pb-4 text-sm md:mb-2 md:mt-2 md:text-center">
          {t("Selectacountry")}
        </div>
      </div>
      <div className="px-6 pb-3">
        <Searchbar onSearch={handleSearch} />
      </div>
      <div
        ref={carouselRef}
        className="w-full overflow-hidden"
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="flex space-x-3"
          style={{
            width: `${countryNames.length * 100}%`,
            transform: `translateX(${slidePosition}px)`,
            marginLeft: countryNames.length === 1 ? 30 : 12,
            transition: isSwiping ? "none" : "transform 0.3s ease-out",
          }}
        >
          {countryNames.map((country, index) => (
            <div key={country} className="card">
              {!loading && allDataLoaded ? (
                <CountryCard
                  country={country}
                  index={index}
                  isFlipped={
                    shouldShowFront(index) ? isAllFlipped : !isAllFlipped
                  }
                  onFlip={handleManualFlip}
                  countryCenters={countryCenters}
                  zoomLevels={zoomLevels}
                  countryFlags={countryFlags}
                  countryAreas={countryAreas}
                  userLoggedIn={userLoggedIn}
                />
              ) : (
                <div className="flex h-[400px] w-[300px] items-center justify-center rounded-lg bg-white">
                  <div className="text-center">
                    <p>Loading country data...</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
