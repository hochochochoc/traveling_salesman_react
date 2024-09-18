import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <>
      <div className="text-lg font-extrabold text-egg">Demonstrations</div>
      <div className="flex justify-end">
        <button
          onClick={() => {
            doSignOut().then(() => {
              navigate("/");
            });
          }}
          className="mr-3 w-24 justify-center rounded-lg border border-egg py-1 text-egg hover:bg-gray-200 hover:text-black active:scale-95"
        >
          Logout
        </button>
      </div>
    </>
  );
}
