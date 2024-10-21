import React from "react";
import Header from "./components/header/Header";
import CountryMapsCarousel from "./components/maps/Maps";
import Demos from "./components/demos/Demos";

export default function MenuPage() {
  return (
    <div className="flex h-full w-auto flex-col bg-egg">
      <div className="flex flex-row justify-center space-x-10">
        <Header />
      </div>
      <div className="mb-3 flex flex-col space-y-3">
        <CountryMapsCarousel />

        <Demos />
      </div>
    </div>
  );
}
