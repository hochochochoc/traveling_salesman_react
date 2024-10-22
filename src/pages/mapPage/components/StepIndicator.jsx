import React from "react";

const StepIndicator = ({ currentStep }) => {
  const displayPosition = currentStep >= 2 ? 3 : currentStep + 1;

  return (
    <div className="my-4 flex justify-center space-x-2">
      {[1, 2, 3].map((step) => (
        <div
          key={step}
          className={`h-2 w-2 rounded-full transition-colors duration-200 ${
            step === displayPosition ? "bg-gray-300" : "bg-landing2"
          }`}
        />
      ))}
    </div>
  );
};

export default StepIndicator;
