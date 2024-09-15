import React from "react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <>
      <div className="text-lg font-extrabold">Algorithm Visualizer</div>
      <div className="flex justify-end">
        <button
          onClick={() => {
            doSignOut().then(() => {
              navigate("/");
            });
          }}
          className="mr-3 flex w-24 justify-center rounded-lg border border-black py-1 hover:bg-gray-200 active:scale-95"
        >
          Logout
        </button>
      </div>
    </>
  );
}
