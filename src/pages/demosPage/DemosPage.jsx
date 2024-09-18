import React from "react";
import Graph from "./components/graphs/PrimsGraph";
import Header from "./components/header/Header";
import { Navigate, useNavigate } from "react-router-dom";

export default function DemosPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-bluedarkest">
      <div className="grid grid-cols-2 p-4">
        <Header />
      </div>

      <div>
        <Graph />
      </div>
      <div>
        <button
          onClick={() => {
            navigate("/");
          }}
        >
          what
        </button>
      </div>
    </div>
  );
}
