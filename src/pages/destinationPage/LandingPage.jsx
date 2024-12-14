import React, { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "../landingPage/components/header/Header";
import QASection from "./components/QandASection";
import Footer from "./components/Footer";
import FeaturesShowcase from "./components/Features";
import { Button } from "@/components/ui/moving-border";

export default function LandingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const contentRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [canScrollPage, setCanScrollPage] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.4;
    }

    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    const handleScroll = (e) => {
      if (!contentRef.current) return;

      const { scrollHeight, scrollTop, clientHeight } = contentRef.current;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 1;

      if (isAtBottom && e.deltaY > 0) {
        setCanScrollPage(true);
      } else if (scrollTop === 0 && e.deltaY < 0) {
        setCanScrollPage(false);
      } else {
        e.preventDefault();

        // Smooth scroll animation
        const start = scrollTop;
        const target = scrollTop + e.deltaY * 0.8;
        const duration = 300; // milliseconds
        const startTime = performance.now();

        const animate = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Easing function for smoother movement
          const easeProgress =
            progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);

          contentRef.current.scrollTop =
            start + (target - start) * easeProgress;

          if (progress < 1) {
            requestAnimationFrame(animate);
          }
        };

        requestAnimationFrame(animate);
      }
    };

    window.addEventListener("wheel", handleScroll, { passive: false });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("wheel", handleScroll);
    };
  }, []);

  return (
    <div className="flex flex-col bg-egg">
      <Header />

      {/* Hero section */}
      <div className="relative h-[82vh] md:h-[780px]">
        {/* Video background */}
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          className="absolute inset-0 h-full w-full object-cover md:mx-auto md:h-[650px]"
        >
          <source
            media="(min-width: 768px)"
            src="/landing_background_desktop.mp4"
            type="video/mp4"
          />
          <source src="/landing_background_v3.mp4" type="video/mp4" />
        </video>

        {/* Title */}
        <div className="fixed left-0 right-0 top-0 z-30 flex justify-center pt-6"></div>

        {/* Scrollable content area */}
        <div
          ref={contentRef}
          className="relative z-10 h-full overflow-y-scroll"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
    div::-webkit-scrollbar {
      display: none;
    }
  `,
            }}
          />

          <div className="min-h-[47vh] w-auto md:min-h-[64vh]">
            <div className="flex h-[73vh] flex-col justify-between md:h-[83vh]">
              <div className="pb-0"></div>
              <div className="relative">
                <div className="absolute inset-0 bottom-[-22%] top-[8%] bg-egg/80 md:bottom-[-34%] md:top-[12%]"></div>
                <h3 className="relative z-10 px-2 text-5xl text-white md:text-center md:font-semibold">
                  {t("VISUALIZINGOPTIMIZATION")}
                </h3>

                <div className="relative z-10 px-4 text-white md:mx-auto md:text-center">
                  <p className="mt-4 md:mx-auto md:w-1/3">
                    {t("welcome_message_1")}
                  </p>
                  <p className="mt-2 text-white md:mx-auto md:mt-4 md:w-1/3 md:pb-4">
                    {t("welcome_message_2")}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons container */}
          <div
            className="sticky bottom-0 left-0 right-0 z-20 flex flex-col items-center space-y-4 pb-8 pt-20 md:pt-16"
            style={{
              background: `linear-gradient(to top, #13141A 80%, rgba(19, 20, 26, 0.85) 85%, rgba(19, 20, 26, 0.6) 90%, rgba(255,255,255,0) 100%)`,
            }}
          >
            <Button
              duration={8000}
              onClick={() => navigate("/menu")}
              borderRadius="3rem"
              containerClassName="w-64"
              className="text-md cursor-pointer rounded-full bg-gradient-to-br from-teal-400 to-blue-500 px-4 py-3 font-bold uppercase text-gray-200 transition-colors hover:bg-white hover:text-black md:text-xl"
            >
              {t("jump_in")}
            </Button>

            <button
              onClick={() => navigate("/tutorial")}
              className="w-64 cursor-pointer rounded-full border border-gray-700 bg-gradient-to-br from-blue-500 to-landing2 px-9 py-3 text-xl font-bold uppercase text-landing1 transition-colors hover:text-white md:text-xl"
            >
              {t("read_tutorial")}
            </button>
          </div>
        </div>
      </div>

      {/* Rest of page content */}
      <div className="bg-egg p-8">
        <QASection />
        <FeaturesShowcase />
      </div>

      <Footer />
    </div>
  );
}
