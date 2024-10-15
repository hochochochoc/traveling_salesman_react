import React, { useState, useRef, useEffect, useCallback } from "react";
import { useTravelingData } from "../../../../context/TravelingContext";
import { useAuth } from "../../../../auth/authContext";
import CountryCard from "./countryCard/CountryCard";

export default function CountryMapsCarousel() {
  const {
    countryCenters,
    zoomLevels,
    countryFlags,
    countryAreas,
    selectedCountries,
    loading,
    error,
  } = useTravelingData();
  const carouselRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);
  const [cardWidth, setCardWidth] = useState(220);
  const [isAutoFlipping, setIsAutoFlipping] = useState(true);
  const [currentFlippedIndex, setCurrentFlippedIndex] = useState(0);
  const { userLoggedIn } = useAuth();

  const flip = useCallback(() => {
    if (isAutoFlipping) {
      setCurrentFlippedIndex((prev) => (prev + 1) % selectedCountries.length);
    }
  }, [isAutoFlipping, selectedCountries.length]);

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

  const countryNames = selectedCountries;

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

      // Calculate maximum slide position (can't scroll further than the last card)
      const maxPosition = -(
        countryNames.length * (cardWidth + 12) -
        carousel.offsetWidth
      );

      // Ensure the new position is within bounds (0 for first slide, maxPosition for last)
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

  if (loading) {
    console.log("Loading country data");
  }

  if (error) {
    console.log(`Error loading country data: ${error.message}`);
  }

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
      <div
        ref={carouselRef}
        className="w-full overflow-hidden"
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="flex space-x-3 pl-1.5"
          style={{
            width: `${countryNames.length * 100}%`,
            transform: `translateX(${slidePosition}px)`,
            transition: isSwiping ? "none" : "transform 0.3s ease-out",
          }}
        >
          {selectedCountries.map((country, index) => (
            <div key={country} className="card">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// TODO / OPTIONAL
// IF LOADING WITH THE SEARCH FUNCTION IS TOO SLOW, TRY PAGINATION???
// I GUESS SKIP THE FAST SCROLL PART
// COMPRESS THE IMAGES??
// MAKE THE AUTOSPIN REINITIALIZE AFTER MANUAL AGAIN
