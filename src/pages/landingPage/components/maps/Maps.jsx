import React, { useState, useRef, useEffect } from "react";
import MapTest from "../maptest/MapTest";
import { useTravelingData } from "../../../../context/TravelingContext";
import { useNavigate } from "react-router-dom";

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

  const countryNames = selectedCountries;

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

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
      const maxPosition = -635;

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
  }, [isSwiping, startX, slidePosition]);

  if (loading) {
    return <div>Loading country data...</div>;
  }

  if (error) {
    return <div>Error loading country data: {error.message}</div>;
  }

  return (
    <div className="rounded-lg bg-tertiary px-4 pt-4">
      <div className="ml-2 font-bold">Choose a map</div>
      <div className="ml-2 pb-1">
        Select a country to try out the algorithms.
      </div>
      <div
        ref={carouselRef}
        className="mx-auto w-full max-w-xs overflow-hidden"
        style={{ touchAction: "pan-y" }}
      >
        <div
          className="flex space-x-3"
          style={{
            width: `${countryNames.length * 100}%`,
            transform: `translateX(${slidePosition}px)`,
            transition: isSwiping ? "none" : "transform 0.3s ease-out",
          }}
        >
          {countryNames.map((country) => (
            <div
              key={country}
              onClick={() => navigate(`/map?country=${country}`)}
            >
              <div className="mb-3 overflow-hidden rounded-lg border border-gray-800 bg-white shadow-md transition-all duration-300 hover:shadow-lg active:scale-95">
                {countryCenters[country] && (
                  <MapTest
                    center={countryCenters[country]}
                    zoom={zoomLevels[country]}
                  />
                )}
                <div className="bg-gradient-to-br from-[#E9D9C8] to-[#A3C9C7] px-3 pb-3">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-bold text-gray-800">
                      {country}
                    </h3>
                    <div className="self-center shadow-lg">
                      <img
                        src={countryFlags[country]}
                        alt={`${country} flag`}
                        className="h-5 w-auto rounded-sm border border-black"
                      />
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    {countryAreas[country]} km²
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
