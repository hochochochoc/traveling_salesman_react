import React, { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useAnimation } from "framer-motion";

export default function LandingPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();

  const buttonAnimation = (startX, startY) => ({
    initial: { x: startX, y: startY },
    animate: {
      x: `calc(${startX} + 57vw)`,
      y: startY,
      transition: {
        duration: 25.0318,
        ease: "linear",
      },
    },
    exit: {
      x: startX,
      y: startY,
      transition: { duration: 0 },
    },
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    if (videoRef.current) {
      videoRef.current.playbackRate = 0.4;
    }

    startAnimation(controls1, "-10vw", "25%");
    startAnimation(controls2, "-10vw", "50%");
    startAnimation(controls3, "-10vw", "75%");
  }, []);

  const startAnimation = (controls, startX, startY) => {
    controls.start("animate").then(() => {
      controls.start("exit").then(() => {
        startAnimation(controls, startX, startY);
      });
    });
  };

  const ButtonComponent = ({ controls, startX, startY, text, id }) => (
    <motion.button
      className="rounded bg-transparent px-3 py-1 font-bold"
      style={{
        color: "black",
        textShadow:
          "1px 1px 0 white, -1px -1px 0 white, 1px -1px 0 white, -1px 1px 0 white",
      }}
      initial="initial"
      animate={controls}
      variants={buttonAnimation(startX, startY)}
      onClick={() => {
        navigate("/demos", {
          state: {
            activeSection: "algorithms",
            algorithmSelection: id,
            validationSelection: "Prims",
          },
        });
      }}
    >
      <span
        className="px-1"
        style={{
          color: "white",
          textShadow:
            "1px 1px 0 black, -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black",
        }}
      >
        •
      </span>
      {text}
    </motion.button>
  );

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
      <div className="fixed left-0 top-0 z-50 h-1/2 w-full">
        <ButtonComponent
          controls={controls1}
          startX="-5vw"
          startY="330%"
          text="Christofides"
          id="Christofides"
        />
        <ButtonComponent
          controls={controls2}
          startX="-6vw"
          startY="520%"
          text="Nearest Neighbor"
          id="Nearest"
        />
        <ButtonComponent
          controls={controls3}
          startX="-40vw"
          startY="390%"
          text="2-Opt"
          id="TwoOpt"
        />
      </div>
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
