import React from "react";
import { useNavigate } from "react-router-dom";

export default function Results() {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate("/")}
      className="h-40 border-b border-black px-4 pt-4"
    >
      <div className="font-bold">Results</div>
    </div>
  );
}
