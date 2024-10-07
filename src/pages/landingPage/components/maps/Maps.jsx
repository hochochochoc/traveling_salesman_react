import React, { useState, useRef, useEffect } from "react";
import MapTest from "../maptest/MapTest";
import { useTravelingData } from "../../../../context/TravelingContext";

const countryNames = ["Brazil", "China", "Spain", "Tanzania"];

export default function CountryMapsCarousel() {
  const { countryCenters, zoomLevels, loading, error } = useTravelingData();
  const carouselRef = useRef(null);
  const [startX, setStartX] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [slidePosition, setSlidePosition] = useState(0);

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
      const newPosition = slidePosition - diff;
      const maxPosition = -(carousel.scrollWidth - carousel.clientWidth);
      setSlidePosition(Math.max(Math.min(newPosition, 0), maxPosition));
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
    <div className="rounded-lg bg-secondary p-4">
      <div className="mb-2 ml-2 font-bold">Choose a map</div>
      <div className="ml-2 pb-4 text-sm">
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
            <div key={country}>
              <div className="w-auto overflow-hidden rounded-lg bg-egg active:scale-95">
                {countryCenters[country] && (
                  <MapTest
                    center={countryCenters[country]}
                    zoom={zoomLevels[country]}
                  />
                )}
                <p className="mx-2 my-1 font-bold">{country}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-4 flex justify-center"></div>
    </div>
  );
}
