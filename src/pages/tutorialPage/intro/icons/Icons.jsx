import React, { useEffect, useState } from "react";
import { Truck, Forklift, Factory, Bot } from "lucide-react";

const AnimatedIcons = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % 4);
    }, 1600);

    return () => clearInterval(timer);
  }, []);

  // Reorder icons to create clockwise animation
  const icons = [
    { Icon: Factory, isActive: activeIndex === 0 }, // Top left
    { Icon: Forklift, isActive: activeIndex === 1 }, // Top right
    { Icon: Truck, isActive: activeIndex === 3 }, // Bottom right
    { Icon: Bot, isActive: activeIndex === 2 }, // Bottom left
  ];

  return (
    <div className="relative">
      <video
        className="absolute inset-0 z-0 h-full w-full rounded-xl object-cover"
        autoPlay
        loop
        muted
      />

      <div className="mt-2 flex flex-col items-center justify-center space-y-3">
        <div className="flex space-x-3">
          {icons.slice(0, 2).map(({ Icon, isActive }, index) => (
            <div
              key={index}
              className={`transition-all duration-300 ${
                isActive ? "scale-110 text-white" : "text-white"
              }`}
            >
              <Icon className="h-20 w-20 rounded-lg bg-black/60 p-1" />
            </div>
          ))}
        </div>
        <div className="flex space-x-3">
          {icons.slice(2, 4).map(({ Icon, isActive }, index) => (
            <div
              key={index}
              className={`transition-all duration-300 ${
                isActive ? "scale-110 text-white" : "text-white"
              }`}
            >
              <Icon className="h-20 w-20 rounded-lg bg-black/60 p-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnimatedIcons;
