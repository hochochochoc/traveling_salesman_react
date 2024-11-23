import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

const RenderOptions = ({ items, activeItem, setActiveItem }) => {
  const scrollContainerRef = useRef(null);
  const { t } = useTranslation();

  return (
    <div
      ref={scrollContainerRef}
      className="hide-scrollbar mt-2 flex overflow-x-auto md:flex md:justify-center"
      style={{
        scrollSnapType: "x mandatory",
        msOverflowStyle: "none",
        scrollbarWidth: "none",
        overflow: "auto",
      }}
    >
      {items.map((item) => (
        <button
          key={item}
          className={`mx-1 flex flex-shrink-0 flex-col items-center justify-center rounded-lg py-3 text-xs font-medium transition-all duration-300 ${
            activeItem === item
              ? "bg-gradient-to-br from-teal-400 to-blue-500 text-white shadow-lg"
              : "bg-gray-800 text-teal-300 hover:text-white"
          }`}
          onClick={() => setActiveItem(item)}
          style={{
            scrollSnapAlign: "center",
            minWidth: "100px",
            height: "100px",
          }}
        >
          <div
            className={`mb-2 rounded-full p-2 ${
              activeItem === item ? "bg-white bg-opacity-30" : "bg-gray-700"
            }`}
          >
            <img
              src={`/icon_${item.toLowerCase()}.png`}
              alt={`${item} icon`}
              className="h-10 w-10"
            />
          </div>
          <span className="w-36 whitespace-normal break-words px-2 text-center">
            {(() => {
              switch (item) {
                case "Nearest":
                  return t("nearest_neighbor_demo");
                case "Greedy":
                  return t("greedy");
                case "TwoOpt":
                  return t("two_opt");
                case "Prims":
                  return t("prims");
                case "Kruskals":
                  return t("kruskals");
                default:
                  return item;
              }
            })()}
          </span>
        </button>
      ))}
    </div>
  );
};

export default RenderOptions;
