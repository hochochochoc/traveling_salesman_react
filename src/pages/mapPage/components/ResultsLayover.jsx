import React from "react";
import { Trophy, Route, Clock, X } from "lucide-react";

const ResultsOverlay = ({
  distance = 0,
  timeInSeconds = 0,
  onTryAgain,
  onClose,
  visible,
}) => {
  if (!visible) return null;

  const formattedDistance =
    typeof distance === "number" ? distance.toFixed(0) : "0";
  const seconds = Math.floor(timeInSeconds);
  const ms = Math.floor((timeInSeconds % 1) * 1000);
  const formattedTime = `${seconds}.${ms.toString().padStart(3, "0")}s`;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
      <div className="mx-4 w-full max-w-md space-y-6 rounded-lg bg-white p-6 text-center shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-2 top-2 rounded-full bg-white p-2 text-gray-500 hover:bg-gray-100"
        >
          <X />
        </button>

        <div className="mx-auto w-16 rounded-full bg-yellow-50 p-4">
          <Trophy className="h-8 w-8 text-yellow-400" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">Tour Completed!</h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <Route className="mx-auto h-5 w-5 text-gray-600" />
            <p className="text-sm text-gray-600">Total Distance</p>
            <p className="text-xl font-bold text-gray-900">
              {formattedDistance} km
            </p>
          </div>

          <div className="space-y-2 rounded-lg bg-gray-50 p-4">
            <Clock className="mx-auto h-5 w-5 text-gray-600" />
            <p className="text-sm text-gray-600">Time Taken</p>
            <p className="text-xl font-bold text-gray-900">{formattedTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsOverlay;
