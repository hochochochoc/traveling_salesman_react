import React, { useEffect, useState } from "react";

const LoadingPopup = ({ estimatedTime }) => {
  const [remainingTime, setRemainingTime] = useState(8);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemainingTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });

      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          return 100;
        }
        return prevProgress + 12.5;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
      <div className="rounded-lg bg-white p-8 shadow-lg">
        <div className="flex flex-col items-center">
          <svg className="h-32 w-32" viewBox="0 0 100 100">
            <circle
              className="stroke-gray-200"
              cx="50"
              cy="50"
              r={radius}
              strokeWidth="10"
              fill="none"
            />
            <circle
              className="stroke-landing2 transition-all duration-500 ease-in-out"
              cx="50"
              cy="50"
              r={radius}
              strokeWidth="10"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transition: "stroke-dashoffset 0.5s ease-in-out",
              }}
            />
            <text
              x="50"
              y="50"
              textAnchor="middle"
              dy="0.3em"
              className="fill-landing2 text-2xl font-bold"
            >
              {Math.round(progress)}%
            </text>
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-800">
            Loading cities, please wait...
          </p>
          <p className="mt-2 text-sm text-gray-600">
            Time remaining: {remainingTime} seconds
          </p>
          {estimatedTime > 5 && (
            <p className="mt-2 text-xs text-gray-500">
              (Estimated total time: {estimatedTime} seconds)
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingPopup;
