import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const buttonsRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.4;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen overflow-y-auto">
      <video
        ref={videoRef}
        src="/landing_background_v2.mp4"
        autoPlay
        loop
        muted
        className="fixed inset-0 h-full w-full object-cover"
      />
      <div
        ref={contentRef}
        className="relative z-10 min-h-[114vh] w-auto py-4"
        style={{
          transform: `translateY(-${Math.min(scrollPosition, 200)}px)`,
          transition: "transform 0.3s ease-out",
        }}
      >
        <div className="flex h-screen flex-col justify-between">
          <div className="flex justify-center pb-10 pt-4">
            <h1 className="font-semibold text-egg">TSP EXPLORER</h1>
          </div>
          <div className="px-4">
            <h3 className="text-4xl text-egg">VISUALIZING OPTIMIZATION</h3>
            <div className="">
              <p className="mt-4 text-white">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
                orci nulla, condimentum nec pulvinar vitae, placerat at leo.
                Vestibulum ornare odio vel rutrum bibendum. Phasellus sit amet
                urna nisi.
              </p>
              <p className="mt-4 text-white">
                Fusce pellentesque mollis augue ac ultricies. Integer vel leo ut
                tortor fermentum rutrum quis ac nunc. Vestibulum a suscipit
                tellus.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-egg via-egg to-transparent p-4"
        style={{
          background:
            "linear-gradient(to top, white 90%, rgba(255,255,255,0) 100%)",
          paddingTop: "35px", // Increase top padding to show more of the fade effect
        }}
      >
        <button
          onClick={() => navigate("/")}
          className="text-md mx-auto mb-4 block cursor-pointer border-4 border-black bg-black px-4 py-2 font-bold text-white"
        >
          GET STARTED
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-md mx-auto block cursor-pointer border-4 border-black px-9 py-2 font-bold text-black"
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}
