import React from "react";
import { useNavigate } from "react-router-dom";

export default function Demos() {
  const navigate = useNavigate();
  return (
    <div className="mt-4 flex flex-col rounded-lg bg-bluedarkest p-4 text-white">
      <p className="mb-2 ml-2 font-bold">How it works</p>
      <p className="ml-2">Try algorithms or validation.</p>
      <button
        onClick={() => {
          navigate("/demos", {
            state: {
              activeSection: "algorithms",
              algorithmSelection: "Nearest",
              validationSelection: "Prims",
            },
          });
        }}
        className="mb-3 mt-2 rounded-lg border border-black bg-gray-800 py-2 text-white active:scale-95"
      >
        Algorithms
      </button>
      <button
        onClick={() => {
          navigate("/demos", {
            state: {
              activeSection: "validation",
              algorithmSelection: "Greedy",
              validationSelection: "Prims",
            },
          });
        }}
        className="rounded-lg border border-black bg-gray-700 py-2 active:scale-95"
      >
        Validation
      </button>
    </div>
  );
}
