import React, { useState } from "react";
import MobileMenu from "../components/Menu";
import Intro from "./intro/Intro";
import Header from "../landingPage/components/header/Header";

export default function TutorialPage() {
  const [intro, setIntro] = useState(true);
  return (
    <div className="flex h-full w-auto flex-col bg-egg text-white">
      <div className="flex flex-row justify-center space-x-10"></div>
      <div className="m-3 flex flex-col space-y-3">
        {intro === true && <Intro setIntro={setIntro} />}

        {intro === false && (
          <div>
            <div className="flex flex-row justify-center space-x-10">
              <Header />
            </div>
            <div className="">
              <h1 className="my-3 text-center text-lg font-bold">
                Step 1: Choose a country
              </h1>

              <img
                className="mx-auto h-[350px]"
                src="countries_screen_v1.png"
              />
              <p className="p-4 text-center">
                Select a free country to explore, or log in to access any
                country you like.
              </p>
            </div>
            <div>
              <h1 className="my-3 text-center text-lg font-bold">
                Step 2: Have a try
              </h1>
              <img className="mx-auto h-[350px]" src="connection_screen.png" />

              <p className="p-4 text-center">
                Try drawing the shortest route between cities yourself, or try
                out some algorithms.
              </p>
            </div>
            <div>
              <h1 className="my-3 text-center text-lg font-bold">
                Step 3: Explore the algorithms
              </h1>
              <img className="mx-auto h-[350px]" src="algorithms_screen.png" />

              <p className="p-4 text-center">
                Dive deeper into how the algorithms and heuristics work.
              </p>
            </div>
            <div className="h-20"></div>
          </div>
        )}

        <MobileMenu />
      </div>
    </div>
  );
}
