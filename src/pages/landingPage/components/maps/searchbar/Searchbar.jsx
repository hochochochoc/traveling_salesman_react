import { useState, useRef, useEffect } from "react";
import { Search, RefreshCcw } from "lucide-react";
import countryList from "./countryList";
import { useTranslation } from "react-i18next";

export default function Searchbar({ onSearch }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSearchClick = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
      setSearchTerm("");
    }
  };

  const getRandomCountries = () => {
    const shuffled = [...countryList].sort(() => 0.5 - Math.random());
    const randomCountries = shuffled.slice(0, 3);
    onSearch(randomCountries);
  };

  return (
    <div className="flex justify-between">
      <div className="relative flex">
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-center"
        >
          <div
            className={`mx-2 flex items-center overflow-hidden rounded-lg bg-egg transition-all duration-300 ease-in-out ${
              isExpanded ? "w-full" : "border-white"
            }`}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder={t("search_country")}
              value={searchTerm}
              onChange={handleSearchChange}
              className={`w-[270px] py-2 pl-4 pr-4 outline-none transition-all duration-200 ease-in-out ${
                isExpanded ? "opacity-100" : "w-0 opacity-0"
              }`}
            />
            <button
              type="button"
              onClick={handleSearchClick}
              className="absolute right-0 p-2 focus:outline-none"
              aria-label={isExpanded ? "Close search" : "Open search"}
            >
              <Search className="mr-2 h-5 w-5 text-gray-300" />
            </button>
          </div>
        </form>
      </div>
      <button
        className="z-40 ml-0"
        onClick={getRandomCountries}
        aria-label="Get random countries"
      >
        <RefreshCcw className="h-5 w-5 text-gray-300" />
      </button>
    </div>
  );
}
