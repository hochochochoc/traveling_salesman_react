import React, { useState } from "react";
import MobileMenu from "../components/Menu";
import Intro from "./intro/Intro";

export default function TutorialPage() {
  const [intro, setIntro] = useState(true);
  return (
    <div className="flex h-full w-auto flex-col bg-egg">
      <div className="flex flex-row justify-center space-x-10"></div>
      <div className="mb-3 flex flex-col space-y-3">
        {intro === true && <Intro />}

        <MobileMenu />
      </div>
    </div>
  );
}
