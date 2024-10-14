import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function Demos() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col border-b border-black text-black">
      <div className="bg-landing2 pt-4 text-white">
        <p className="ml-3 pb-10 text-5xl font-bold uppercase">How it works</p>
        <p className="mx-3 pb-2 text-sm">
          Understand the logic behind the algorithms for solving the TSP and
          their validation.
        </p>
      </div>

      <img
        className="mx-auto h-[50vh] w-screen border-t border-black object-cover p-3"
        src="/blackboard_v4.png"
        alt="Blackboard"
      />
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
        className="mb-3 flex items-center justify-center space-x-5 border-b border-t border-black py-2 active:scale-95"
      >
        <ArrowRight />
        <span className="text-xl">Algorithms</span>
      </button>
      <img
        className="mx-auto h-[50vh] w-screen border-t border-black object-cover p-3"
        src="/wind_tunnel.jpg"
        alt="WindTunnel"
      />
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
        className="mb-3 flex items-center justify-center space-x-5 border-b border-t border-black py-2 active:scale-95"
      >
        <ArrowRight />
        <span className="text-xl">Validation</span>
      </button>
    </div>
  );
}
