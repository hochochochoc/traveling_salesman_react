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
          <span className="w-32 whitespace-normal break-words px-2 text-center">
            {(() => {
              switch (item) {
                case "Nearest":
                  return "Nearest Neighbor";
                case "Greedy":
                  return "Greedy Heuristic";
                case "TwoOpt":
                  return "2-Opt Method";
                case "Prims":
                  return "Prim's Algorithm";
                case "Kruskals":
                  return "Kruskal's Algorithm";
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
