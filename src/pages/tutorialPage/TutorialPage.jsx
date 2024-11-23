import React, { useState } from "react";
import MobileMenu from "../components/Menu";
import Intro from "./intro/Intro";
import Header from "../landingPage/components/header/Header";
import { useTranslation } from "react-i18next";

export default function TutorialPage() {
  const [intro, setIntro] = useState(true);
  const { t } = useTranslation();

  return (
    <div className="flex h-full min-h-screen w-auto flex-col overflow-x-hidden bg-gradient-to-b from-egg to-gray-800 text-white">
      <div className="hidden flex-row justify-center space-x-10 md:flex">
        <Header />
      </div>
      <div className="flex flex-row justify-center space-x-10"></div>
      <div className="m-3 flex flex-col space-y-3">
        {intro === true && (
          <div>
            <Intro setIntro={setIntro} />
          </div>
        )}

        {intro === false && (
          <div>
            <div className="flex flex-row justify-center space-x-10"></div>
            <div className="">
              <h1 className="my-3 text-center text-lg font-bold">
                {t("tutorial_s1")}
              </h1>

              <img
                className="mx-auto h-[350px]"
                src="countries_screen_v1.png"
              />
              <p className="p-4 text-center">{t("tutorial_d1")}</p>
            </div>
            <div>
              <h1 className="my-3 text-center text-lg font-bold">
                {t("tutorial_s2")}
              </h1>
              <img className="mx-auto h-[350px]" src="connection_screen.png" />

              <p className="p-4 text-center">{t("tutorial_d2")}</p>
            </div>
            <div>
              <h1 className="my-3 text-center text-lg font-bold">
                {t("tutorial_s3")}
              </h1>
              <img className="mx-auto h-[350px]" src="algorithms_screen.png" />

              <p className="p-4 text-center">{t("tutorial_d3")}</p>
            </div>
          </div>
        )}
        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </div>
  );
}
