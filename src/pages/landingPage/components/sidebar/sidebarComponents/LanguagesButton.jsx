import React, { useState, useEffect } from "react";
import i18n from "i18next"; // Import i18n directly

const languages = [
  { code: "en", name: "English" },
  { code: "ca", name: "Catalá" },
  { code: "es", name: "Español" },
];

const LanguagesButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    const currentLanguageCode = i18n.language || "en";
    const currentLanguage = languages.find(
      (lang) => lang.code === currentLanguageCode,
    );
    setSelectedLanguage(currentLanguage);
  }, []);

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    setIsOpen(false);
    i18n.changeLanguage(language.code);
  };

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center p-2 text-gray-200"
      >
        <span className="text-2xl font-semibold">
          {selectedLanguage ? selectedLanguage.name : "Loading..."}
        </span>
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
