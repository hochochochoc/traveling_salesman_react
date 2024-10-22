import React, { useState } from "react";
import Header from "./components/header/Header";
import CountryMapsCarousel from "./components/maps/Maps";
import Demos from "./components/demos/Demos";
import MobileMenu from "../components/menu";

export default function MenuPage() {
  const [mapState, setMapState] = useState("countries");
  return (
    <div className="flex h-full w-auto flex-col bg-egg">
      <div className="flex flex-row justify-center space-x-10">
        <Header />
      </div>
      <div className="mb-3 flex flex-col space-y-3">
        {mapState === "countries" && <CountryMapsCarousel />}

        {mapState === "Demos" && <Demos />}
        <MobileMenu />
      </div>
    </div>
  );
}
