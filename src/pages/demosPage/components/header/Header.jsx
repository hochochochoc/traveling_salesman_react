import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Header() {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center">
        <button
          onClick={() => {
            navigate("/menu");
          }}
        >
          <ArrowLeft className="text-black" />
        </button>
      </div>
      <div className="flex items-center text-lg font-extrabold text-white">
        How It Works
      </div>
      <div></div>
    </>
  );
}
