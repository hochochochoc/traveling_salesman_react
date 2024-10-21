import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function LandingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.4;
    }

    // Set a timeout to ensure all necessary elements are ready
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isReady) {
      controls1.start("animate");
      controls2.start("animate");
      controls3.start("animate");
    }
  }, [isReady, controls1, controls2, controls3]);

  return (
    <div className="relative min-h-screen overflow-y-auto overflow-x-hidden">
      <video
        ref={videoRef}
        src="/landing_background_v3.mp4"
        autoPlay
        loop
        muted
        className="fixed inset-0 h-full w-full object-cover"
      />

      <div className="fixed left-0 right-0 top-0 z-30 flex justify-center pt-6">
        <h1 className="font-semibold text-egg">TSP EXPLORER</h1>
      </div>

      <div className="relative z-10 min-h-[125vh] w-auto py-4 pt-16">
        <div className="flex h-[95vh] flex-col justify-between">
          <div className="pb-2"></div>
          <div className="relative">
            <div
              className="absolute inset-0 bg-landing2 bg-opacity-80"
              style={{ top: "8%" }}
            ></div>
            <h3 className="relative z-10 px-2 text-4xl text-egg">
              {t("VISUALIZINGOPTIMIZATION")}
            </h3>

            <div className="relative z-10 px-4 text-egg">
              <p className="mt-4">{t("welcome_message_1")}</p>
              <p className="mt-2 pb-12 text-egg">{t("welcome_message_2")}</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 z-20 flex flex-col items-center space-y-4 pb-8 pt-20"
        style={{
          background:
            "linear-gradient(to top, rgba(44, 95, 124,1) 80%, rgba(44, 95, 124,0.85) 85%, rgba(44, 95, 124,0.6) 90%, rgba(255,255,255,0) 100%)",
        }}
      >
        <button
          onClick={() => navigate("/menu")}
          className="text-md w-64 cursor-pointer border-4 border-black bg-black px-4 py-2 font-bold text-white transition-colors hover:bg-white hover:text-black"
        >
          JUMP IN!
        </button>
        <button
          onClick={() => navigate("/menu")}
          className="text-md w-64 cursor-pointer border-4 border-black px-9 py-2 font-bold text-black transition-colors hover:bg-black hover:text-white"
        >
          SIGN UP
        </button>
      </div>
    </div>
  );
}
