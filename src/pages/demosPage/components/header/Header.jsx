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
          <ArrowLeft className="text-white" />
        </button>
      </div>
      <div className="flex items-center text-lg font-extrabold text-egg">
        Demonstrations
      </div>
      <div>
        <button
          onClick={() => {
            doSignOut().then(() => {
              navigate("/");
            });
          }}
          className="w-24 rounded-lg border border-egg py-1 text-egg hover:bg-gray-200 hover:text-black active:scale-95"
        >
          Log in
        </button>
      </div>
    </>
  );
}
