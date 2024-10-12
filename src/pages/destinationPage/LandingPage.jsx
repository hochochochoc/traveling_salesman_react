import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const controls = useAnimation();

  const buttonAnimation = {
    initial: { x: "-10vw" },
    animate: {
      x: "47vw", // Move to the right
      transition: {
        duration: 25.0325, // Duration of the animation
        ease: "linear", // Smooth linear movement
      },
    },
    exit: {
      x: "-10vw", // Reset position instantly
      transition: { duration: 0 }, // No transition during reset
    },
  };

  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.4;
    }

    startAnimation(); // Start the animation on mount
  }, []);

  const startAnimation = () => {
    controls.start("animate").then(() => {
      controls.start("exit").then(() => {
        startAnimation(); // Loop the animation
      });
    });
  };

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
      <motion.div className="fixed left-0 top-1/4 z-50 flex space-x-4">
        <motion.button
          className="rounded bg-transparent px-3 py-1 font-bold"
          style={{
            color: "black",
            textShadow:
              "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white", // For the text
          }}
          initial="initial"
          animate={controls} // Use controls for animation
          variants={buttonAnimation}
          onClick={() => {
            navigate("/demos", {
              state: {
                activeSection: "algorithms",
                algorithmSelection: "Christofides",
                validationSelection: "Prims",
              },
            });
          }}
        >
          {/* Dot with its own styling */}
          <span
            className="px-1"
            style={{
              color: "white", // Inside color for dot
              textShadow:
                "1px 1px 0 black, -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black", // Black outline for dot
            }}
          >
            •
          </span>
          Christofides
        </motion.button>
      </motion.div>
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
              VISUALIZING OPTIMIZATION
            </h3>

            <div className="relative z-10 px-4 text-egg">
              <p className="mt-4">
                Welcome to TSP Explorer, where we bring the Traveling Salesman
                Problem to life through interactive demos, visual maps, and
                algorithm codes. Explore optimization solutions and learn at
                your own pace.
              </p>
              <p className="mt-2 pb-12 text-egg">
                Try your hand at solving the problem, discover new algorithms,
                and deepen your understanding of route optimization in a fun,
                visual way.
              </p>
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
          GET STARTED
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
