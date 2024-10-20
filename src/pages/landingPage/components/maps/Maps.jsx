import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTravelingData } from "../../../../context/TravelingContext";
import { useAuth } from "../../../../auth/authContext";
import CountryCard from "./countryCard/CountryCard";
import Searchbar from "./searchbar/Searchbar";

export default function CountryMapsCarousel() {
  const {
    countryCenters,
    zoomLevels,
    countryFlags,
    countryAreas,
    selectedCountries,
    loading,
    error,
    setNewCountries,
  } = useTravelingData();
  const carouselRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [slidePosition, setSlidePosition] = useState(1);
  const [cardWidth, setCardWidth] = useState(220);
  const [isAutoFlipping, setIsAutoFlipping] = useState(true);
  const [currentFlippedIndex, setCurrentFlippedIndex] = useState(1);
  const [countryNames, setCountryNames] = useState(selectedCountries);
  const { userLoggedIn } = useAuth();

  const handleSearch = async (searchTerm) => {
    let formattedCountries;
    let success = true;

    if (Array.isArray(searchTerm)) {
      // Handle multiple random countries
      const countriesToFetch = [];
      for (const country of searchTerm) {
        if (!selectedCountries.includes(country) && !countryCenters[country]) {
          countriesToFetch.push(country);
        }
      }

      // Fetch data for all new countries
      if (countriesToFetch.length > 0) {
        const results = await Promise.all(
          countriesToFetch.map((country) => setNewCountries(country)),
        );
        success = results.every((result) => result === true);
      }

      formattedCountries = success ? searchTerm : selectedCountries;
    } else if (searchTerm) {
      // Handle single country search
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
      // Reset to the original country list if search term is empty
      formattedCountries = selectedCountries;
    }

    if (success) {
      setCountryNames(formattedCountries);
      setSlidePosition(0);
      setCurrentFlippedIndex(0);
      setIsAutoFlipping(true);
    }
  };

  const flip = useCallback(() => {
    if (isAutoFlipping) {
      setCurrentFlippedIndex((prev) => (prev + 1) % countryNames.length);
    }
  }, [isAutoFlipping, countryNames.length]);

  useEffect(() => {
    const flipInterval = setInterval(flip, 5000);
    return () => clearInterval(flipInterval);
  }, [flip]);

  const handleManualFlip = (index) => {
    setCurrentFlippedIndex(index);
    setIsAutoFlipping(false);

    setTimeout(() => {
      setIsAutoFlipping(true);
    }, 600);
  };

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

  // Wait for all country data to be loaded
  const allDataLoaded = countryNames.every(
    (country) =>
      countryCenters[country] && zoomLevels[country] && countryFlags[country],
  );

  return (
    <div className="border-b border-black">
      <div className="bg-landing2 px-3 pt-4 text-white">
        <div className="pb-10 text-5xl font-bold uppercase">
          Choose a country
        </div>
        <div className="pb-2 text-sm">
          Select a country to try out the algorithms.
        </div>
      </div>
      <div className="bg-egg px-6 py-1">
        <Searchbar onSearch={handleSearch} />
      </div>
      <div
        ref={carouselRef}
        className="w-full overflow-hidden"
        style={{
          touchAction: "pan-y",
        }}
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
                  isFlipped={currentFlippedIndex === index}
                  onFlip={handleManualFlip}
                  countryCenters={countryCenters}
                  zoomLevels={zoomLevels}
                  countryFlags={countryFlags}
                  countryAreas={countryAreas}
                  userLoggedIn={userLoggedIn}
                />
              ) : (
                <div className="flex h-[400px] w-[300px] items-center justify-center border border-black bg-white">
                  <div className="text-center">
                    <div className="mb-2 animate-spin text-2xl">⌛</div>
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
