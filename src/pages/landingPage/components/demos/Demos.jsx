import React from "react";
import { useNavigate } from "react-router-dom";

export default function Demos() {
  const navigate = useNavigate();
  return (
    <div className="mr-2 mt-4 flex flex-col rounded-lg bg-tertiary p-4">
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
        className="mb-3 mt-2 rounded-lg border border-black bg-black py-2 text-white active:scale-95"
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
        className="rounded-lg border border-black py-2 active:scale-95"
      >
        Validation
      </button>
    </div>
  );
}
