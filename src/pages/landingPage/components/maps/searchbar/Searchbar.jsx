import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";

export default function Searchbar({ onSearch }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef(null);

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
    onSearch(searchTerm);
  };

  return (
    <div className="relative">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center"
      >
        <div
          className={`mx-4 flex items-center overflow-hidden border border-gray-300 bg-egg transition-all duration-300 ease-in-out ${
            isExpanded ? "w-full" : "border-white"
          }`}
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Select a country..."
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full py-2 pl-4 pr-10 outline-none transition-all duration-200 ease-in-out ${
              isExpanded ? "opacity-100" : "w-0 opacity-0"
            }`}
          />
          <button
            type="button"
            onClick={handleSearchClick}
            className="absolute right-0 p-2 focus:outline-none"
            aria-label={isExpanded ? "Close search" : "Open search"}
          >
            <Search className="mr-4 h-5 w-5 text-gray-500" />
          </button>
        </div>
      </form>
    </div>
  );
}
