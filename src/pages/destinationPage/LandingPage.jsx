import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.6;
    }
  }, []);

  return (
    <div className="relative h-screen">
      <video
        ref={videoRef}
        src="/landing_background_v2.mp4" // Path to your video
        autoPlay
        loop
        muted
        className="absolute left-0 top-0 h-full w-full object-cover"
      />
      <div className="z-10 flex w-auto flex-col bg-primary bg-opacity-50 p-4">
        <h1 className="text-white">Landing Page</h1>
        <div
          onClick={() => navigate("/")}
          className="mt-4 cursor-pointer text-white"
        >
          return
        </div>
      </div>
    </div>
  );
}
