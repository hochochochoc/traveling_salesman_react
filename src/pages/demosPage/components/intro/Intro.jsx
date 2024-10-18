import React, { useRef, useEffect, useState, useContext } from "react";
import BigO from "./bigO/bigO";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { DemosContext } from "../../context/GraphContext";

const Intro = () => {
  const videoRef = useRef(null);
  const [step, setStep] = useState(0);

  const { intro, setIntro } = useContext(DemosContext);

  useEffect(() => {
    window.scrollTo(0, 0);

    if (videoRef.current) {
      videoRef.current.playbackRate = 1;
    }
  });
  return (
    <div>
      <div className="relative h-full w-full">
        {step === 0 && (
          <div>
            <video
              ref={videoRef}
              src="/intro_6.mp4"
              autoPlay
              loop
              muted
              className="absolute inset-0 z-0 h-full w-full object-cover"
            />
            <div className="relative z-10 p-4 text-white">
              <p className="my-10 text-5xl font-extrabold">What is the TSP?</p>
              <p className="h-[26rem] text-lg font-semibold">
                The Traveling Salesman Problem is an issue in computer science,
                the goal of which is to find the shortest circular route through
                a set of points.
              </p>

              <button
                className="my-3 ml-auto mr-3 flex w-min rounded-full border border-white bg-landing2 p-2 opacity-80"
                onClick={() => setStep(step + 1)}
              >
                <ArrowRight className="text-white" />
              </button>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <video
              ref={videoRef}
              src="/intro_8.mp4"
              autoPlay
              loop
              muted
              className="absolute inset-0 z-0 h-full w-full object-cover"
            />
            <div className="relative z-10 p-4 text-white">
              <p className="my-10 text-5xl font-extrabold">Where is it used?</p>
              <p className="h-[26rem] text-lg font-semibold">
                The TSP is used in many contexts where an optimal route has to
                be drawn that reconnects with the original point, such as in
                logistics, manufacturing and robotics.
              </p>

              <div className="flex justify-end">
                <button
                  className="my-3 ml-auto mr-3 flex w-min rounded-full border border-white bg-landing2 p-2 opacity-80"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft className="text-white" />
                </button>
                <button
                  className="my-3 mr-3 flex w-min rounded-full border border-white bg-landing2 p-2 opacity-80"
                  onClick={() => setStep(step + 1)}
                >
                  <ArrowRight className="font-semibold text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <video
              ref={videoRef}
              src="/intro_4.mp4"
              autoPlay
              loop
              muted
              className="absolute inset-0 z-0 h-full w-full object-cover"
            />
            <div className="relative z-10 p-4 text-white">
              <p className="my-10 text-5xl font-extrabold">
                Why is it relevant?
              </p>
              <p className="text-lg font-semibold">
                The TSP has exponential time com-plexity (O(n!)), meaning
                computation time grows rapidly as the number of points
                increases. Therefore, approxi-mation algorithms are used to find
                efficient near-optimal solutions instead.
              </p>
              <BigO />
              <div className="mb-4 mt-1 flex justify-end">
                <button
                  className="my-3 ml-auto mr-3 flex w-min rounded-full border border-white bg-landing2 p-2 opacity-80"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft className="text-white" />
                </button>
                <button
                  className="my-3 mr-3 flex w-min rounded-full border border-white bg-landing2 p-2 opacity-80"
                  onClick={() => setIntro(1)}
                >
                  <ArrowRight className="font-semibold text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Intro;
