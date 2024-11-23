import React, { useRef, useEffect, useState, useContext } from "react";
import BigO from "./bigO/bigO";
import { ArrowRight, ArrowLeft, X } from "lucide-react";
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
              className="absolute inset-0 z-0 h-full w-full rounded-xl object-cover"
              ref={videoRef}
              src="/intro_6.mp4"
              autoPlay
              loop
              muted
            />
            <div className="relative z-10 rounded-lg p-4 text-white">
              <p className="mb-10 mt-5 text-5xl font-extrabold">
                What is the TSP?
              </p>
              <p className="h-[26rem] text-lg font-semibold">
                The Traveling Salesman Problem is an issue in computer science,
                the goal of which is to find the shortest circular route through
                a set of points.
              </p>
              <div className="flex justify-between">
                <button
                  className="absolute left-1/2 my-3 -translate-x-1/2 transform rounded-xl border border-white/30 bg-white/20 px-4 py-2 text-white"
                  onClick={() => setIntro(1)}
                >
                  Skip
                </button>
                <button
                  className="my-3 ml-auto mr-3 flex w-min rounded-full border border-white/30 bg-white/20 p-2"
                  onClick={() => setStep(step + 1)}
                >
                  <ArrowRight className="text-white" />
                </button>
              </div>
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <video
              className="absolute inset-0 z-0 h-full w-full rounded-xl object-cover"
              ref={videoRef}
              src="/intro_8_v2.mp4"
              autoPlay
              loop
              muted
            />
            <div className="relative z-10 p-4 text-white">
              <p className="mb-10 mt-5 text-5xl font-extrabold">
                Where is it used?
              </p>
              <p className="h-[26rem] text-lg font-semibold">
                The TSP is used in many contexts where an optimal circular route
                has to be drawn, such as in logistics, manufacturing and
                robotics.
              </p>

              <div className="flex justify-end">
                <button
                  className="my-3 ml-auto mr-3 flex w-min rounded-full border border-white/30 bg-white/20 p-2"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft className="text-white" />
                </button>
                <button
                  className="my-3 mr-3 flex w-min rounded-full border border-white/30 bg-white/20 p-2"
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
              className="absolute inset-0 z-0 h-full w-full rounded-xl object-cover"
              ref={videoRef}
              src="/intro_4.mp4"
              autoPlay
              loop
              muted
            />
            <div className="relative z-10 p-4 text-white">
              <p className="mb-10 mt-5 text-5xl font-extrabold">
                Why is it relevant?
              </p>
              <p className="text-lg font-semibold">
                The TSP has exponential time complexity (O(n!)), meaning
                computation time grows rapidly as the number of points
                increases. Therefore, algorithms are used to find efficient
                near-optimal solutions instead.
              </p>
              <BigO />
              <div className="mt-1 flex justify-end">
                <button
                  className="my-3 ml-auto mr-3 flex w-min rounded-full border border-white/30 bg-white/20 p-2"
                  onClick={() => setStep(step - 1)}
                >
                  <ArrowLeft className="text-white" />
                </button>
                <button
                  className="my-3 mr-3 flex w-min rounded-full border border-white/30 bg-white/20 p-2"
                  onClick={() => setIntro(1)}
                >
                  <X className="font-semibold text-white" />
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
