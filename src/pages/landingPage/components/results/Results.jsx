import React from "react";
import { useNavigate } from "react-router-dom";

export default function Results() {
  const navigate = useNavigate();
  return (
    <div onClick={() => navigate("/")} className="h-20 rounded-lg bg-egg p-4">
      <div className="font-bold">Results</div>
    </div>
  );
}
