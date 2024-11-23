import React, { useRef, useEffect, useState } from "react";
import { ArrowRight, ArrowLeft, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import TutorialTSP from "./tutorialTSP/TutorialTSP";
import AnimatedIcons from "./icons/Icons";
import BigO from "./bigO/bigO";

const TutorialCard = ({ isActive, offset, children }) => {
  const isThirdCard = offset === 2;

  const getTransform = () => {
    if (isActive) {
      return "translate3d(0, 0, 0) scale(1)";
    }
    if (offset > 0) {
      return `translate3d(80%, 0, -100px) scale(0.9)`;
    }
    return `translate3d(-80%, 0, -100px) scale(0.9)`;
  };

  return (
    <div
      className="absolute inset-0 origin-center"
      style={{
        transform: getTransform(),
        opacity: isActive ? 1 : 0.8,
        zIndex: isActive ? 3 : 2 - Math.abs(offset),
        transition: isThirdCard
          ? isActive
            ? "all 500ms ease-in-out"
            : "none"
          : "all 500ms ease-in-out",
        visibility: Math.abs(offset) <= 1 || isActive ? "visible" : "hidden",
      }}
    >
      {children}
    </div>
  );
};

export default function Intro({ setIntro }) {
  const videoRef = useRef(null);
  const [step, setStep] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (videoRef.current) {
      videoRef.current.playbackRate = 1;
    }
  });

  const cards = [
    // Card 1
    <div key="card-0" className="h-full rounded-xl shadow-lg">
      <video
        className="absolute inset-0 z-0 h-full w-full rounded-xl object-cover"
        ref={videoRef}
        src="/intro_6.mp4"
        autoPlay
        loop
        muted
      />
      <div className="relative z-10 rounded-lg pt-4 text-white">
        <p className="h-[6.5rem] px-4 text-4xl font-extrabold h-md:text-5xl">
          {t("what_is_tsp")}
        </p>
        <div className="h-[27rem] md:h-[32rem]">
          <p className="mx-2 rounded-lg bg-black/30 px-2 text-lg font-semibold">
            {t("description_1")}
          </p>
          <div className="px-4">
            <TutorialTSP />
          </div>
        </div>
        <div className="flex justify-between">
          <button
            className="absolute left-1/2 my-1 -translate-x-1/2 transform rounded-xl border border-white/30 bg-red-600/20 px-4 py-2 text-white"
            onClick={() => setIntro(false)}
          >
            {t("skip_button")}
          </button>
          <button
            className="my-1 ml-auto mr-3 flex w-min rounded-full border border-white/30 bg-white/20 p-2"
            onClick={() => setStep(step + 1)}
          >
            <ArrowRight className="text-white" />
          </button>
        </div>
      </div>
    </div>,
    // Card 2
    <div key="card-1" className="h-full rounded-xl shadow-lg">
      <video
        className="absolute inset-0 z-0 h-full w-full rounded-xl object-cover"
        src="/intro_8_v3.mp4"
        autoPlay
        loop
        muted
      />
      <div className="relative z-10 pt-4 text-white">
        <p className="h-[6.5rem] px-4 text-4xl font-extrabold h-md:text-5xl">
          {t("where_used")}
        </p>
        <div className="h-[27rem] md:h-[32rem]">
          <p className="mx-2 mb-4 rounded-lg bg-black/30 px-2 text-lg font-semibold">
            {t("description_2")}
          </p>
          <AnimatedIcons />
        </div>
        <div className="flex justify-end">
          <button
            className="my-1 ml-auto mr-3 flex w-min rounded-full border border-white/30 bg-white/20 p-2"
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft className="text-white" />
          </button>
          <button
            className="my-1 mr-3 flex w-min rounded-full border border-white/30 bg-white/20 p-2"
            onClick={() => setStep(step + 1)}
          >
            <ArrowRight className="font-semibold text-white" />
          </button>
        </div>
      </div>
    </div>,
    // Card 3
    <div key="card-2" className="h-full rounded-xl shadow-lg">
      <video
        className="absolute inset-0 z-0 h-full w-full rounded-xl object-cover"
        src="/intro_4.mp4"
        autoPlay
        loop
        muted
      />
      <div className="relative z-10 pt-4 text-white">
        <p className="h-[6.5rem] px-4 text-4xl font-extrabold h-md:text-5xl">
          {t("why_relevant")}
        </p>
        <div className="h-[27rem] md:h-[32rem]">
          <p className="mx-2 rounded-lg bg-black/30 px-2 text-[17px] font-semibold">
            {t("description_3")}
          </p>
          <div className="px-2">
            <BigO />
          </div>
        </div>
        <div className="flex justify-end">
          <button
            className="my-1 ml-auto mr-3 flex w-min rounded-full border border-white/30 bg-white/20 p-2"
            onClick={() => setStep(step - 1)}
          >
            <ArrowLeft className="text-white" />
          </button>
          <button
            className="my-1 mr-3 flex w-min rounded-full border border-white/20 bg-red-800/40 p-2"
            onClick={() => setIntro(false)}
          >
            <X className="font-semibold text-white" />
          </button>
        </div>
      </div>
    </div>,
  ];

  return (
    <div className="mx-auto flex w-auto flex-col md:mt-4 md:w-[400px]">
      <div className="flex flex-row justify-center space-x-10"></div>
      <div className="relative h-[600px] w-full [perspective:1200px]">
        {cards.map((card, index) => (
          <TutorialCard
            key={index}
            isActive={index === step}
            offset={index - step}
          >
            {card}
          </TutorialCard>
        ))}
      </div>
      <div className="mb-3 flex flex-col space-y-3"></div>
    </div>
  );
}
