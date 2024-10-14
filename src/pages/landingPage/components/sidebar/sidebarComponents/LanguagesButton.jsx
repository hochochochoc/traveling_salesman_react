import React, { useState } from "react";
import { Languages } from "lucide-react";
const languages = [
  { code: "en", name: "English" },
  { code: "ca", name: "Catalá" },
  { code: "es", name: "Español" },
];

const LanguagesButton = ({ onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    if (onLanguageChange) {
      onLanguageChange(language.code);
    }
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center rounded-md p-2 text-gray-900 transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
      >
        <span className="text-2xl font-semibold">{selectedLanguage.name}</span>
      </button>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div
            className="py-1"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="options-menu"
          >
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language)}
                className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                role="menuitem"
              >
                {language.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguagesButton;
