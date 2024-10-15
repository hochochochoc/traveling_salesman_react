import React, { useState, useRef, useEffect, useCallback } from "react";
import MapTest from "../maptest/MapTest";
import { useTravelingData } from "../../../../context/TravelingContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../auth/authContext";
import { div } from "framer-motion/client";

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
  const navigate = useNavigate();
  const [cardWidth, setCardWidth] = useState(220);
  const [isAutoFlipping, setIsAutoFlipping] = useState(true);
  const [currentFlippedIndex, setCurrentFlippedIndex] = useState(0); // Start from first index
  const { userLoggedIn } = useAuth();

  const flip = useCallback(() => {
    if (isAutoFlipping) {
      setCurrentFlippedIndex((prev) => (prev + 1) % selectedCountries.length); // Loop back to start
    }
  }, [isAutoFlipping, selectedCountries.length]);

  useEffect(() => {
    const flipInterval = setInterval(flip, 8000);
    return () => clearInterval(flipInterval);
  }, [flip]);

  const handleManualFlip = (index) => {
    if (currentFlippedIndex === index) return; // Prevent flipping if already flipped

    setCurrentFlippedIndex(index);
    setIsAutoFlipping(false);

    // Reset the auto-flipping after a manual flip
    setTimeout(() => {
      setIsAutoFlipping(true);
    }, 600); // After the flip duration
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
      const diff = startX - x;
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
    return <div>Loading country data...</div>;
  }

  if (error) {
    return <div>Error loading country data: {error.message}</div>;
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
          {countryNames.map((country, index) => (
            <div key={country} className="card">
              <div
                className="my-3"
                style={{
                  perspective: "1000px",
                  width: "300px",
                  height: "400px",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    transition: "transform 0.6s",
                    transformStyle: "preserve-3d",
                    transform:
                      currentFlippedIndex === index ? "rotateY(180deg)" : "",
                  }}
                >
                  <div
                    className="flex h-full w-full items-center justify-center"
                    style={{
                      position: "absolute",
                      backfaceVisibility: "hidden",
                      backgroundColor: "#ffffff",
                      border: "1px solid #000000",
                    }}
                    onClick={() => handleManualFlip(index)}
                  >
                    <img
                      className="h-full w-full object-cover p-2 shadow-lg"
                      src={`/${country}.jpg?height=380&width=280`}
                      alt={country}
                    />
                  </div>
                  <div
                    className="relative flex h-full w-full items-center justify-center bg-white shadow-lg"
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                    onClick={() => {
                      if (
                        !userLoggedIn &&
                        country !== "Brazil" &&
                        country !== "Spain" &&
                        country !== "Egypt" &&
                        country !== "Vietnam" &&
                        country !== "Bangladesh"
                      ) {
                        return;
                      }
                      navigate(`/map?country=${country}`);
                    }}
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
                        <div className="w-full border-t border-black bg-white pl-3">
                          <div className="flex justify-between">
                            <h3 className="text-2xl font-bold text-black">
                              {country}
                            </h3>
                            <div className="mx-2 self-center shadow-lg">
                              <img
                                src={countryFlags[country]}
                                alt={`${country} flag`}
                                className="h-5 w-auto rounded-sm border border-black"
                              />
                            </div>
                          </div>
                          <p className="mt-1 text-sm text-black">
                            {countryAreas[country]} km²
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
