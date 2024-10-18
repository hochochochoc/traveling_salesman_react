import React, { useRef } from "react";

const RenderOptions = ({ items, activeItem, setActiveItem }) => {
  const scrollContainerRef = useRef(null);

  return (
    <div
      ref={scrollContainerRef}
      className="hide-scrollbar mt-2 flex overflow-x-auto md:overflow-x-scroll"
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
          className={`mx-1 flex flex-shrink-0 flex-col items-center justify-center py-3 text-xs font-medium transition-all duration-300 ${
            activeItem === item
              ? "rounded-sm bg-gradient-to-br from-teal-400 to-blue-500 text-white shadow-lg"
              : "bg-gray-900 text-teal-300 hover:bg-gray-700 hover:text-white"
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
          <span className="text-center">{item}</span>
        </button>
      ))}
    </div>
  );
};

export default RenderOptions;
