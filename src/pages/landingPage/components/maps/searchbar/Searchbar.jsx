import { useState, useRef, useEffect } from "react";
import { RefreshCcw } from "lucide-react";
import countryList from "./countryList";
import { useTranslation } from "react-i18next";
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";

export default function Searchbar({ onSearch }) {
  const { t } = useTranslation();

  const defaultCountries = ["Brazil", "Spain", "Bangladesh", "Vietnam"];

  // Show default countries when component mounts
  useEffect(() => {
    onSearch(defaultCountries);
  }, []);

  const getRandomCountries = () => {
    const shuffled = [...countryList].sort(() => 0.5 - Math.random());
    const randomCountries = shuffled.slice(0, 3);
    onSearch(randomCountries);
  };

  const searchPlaceholders = [
    "España",
    "Francia",
    "Vietnam",
    "Japón",
    "Egipto",
    "India",
    "Brasil",
    "Argentina",
  ];

  return (
    <div className="flex justify-start space-x-2 md:justify-center">
      <div>
        <PlaceholdersAndVanishInput
          placeholders={searchPlaceholders}
          onSubmit={(e) => {
            e.preventDefault();
            if (e.target[0].value.trim()) {
              onSearch(e.target[0].value);
            } else {
              onSearch(defaultCountries);
            }
          }}
        />
      </div>

      <button
        className="z-40 ml-0"
        onClick={getRandomCountries}
        aria-label="Get random countries"
      >
        <RefreshCcw className="ml-3 h-5 w-5 text-gray-300" />
      </button>
    </div>
  );
}
