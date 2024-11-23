import React, { useState } from "react";
import Header from "./components/header/Header";
import CountryMapsCarousel from "./components/maps/Maps";
import MobileMenu from "../components/Menu";

export default function MenuPage() {
  const [mapState, setMapState] = useState("countries");
  return (
    <div className="flex h-screen w-auto flex-col bg-gradient-to-b from-egg to-gray-800">
      <div className="flex flex-row justify-center space-x-10">
        <Header />
      </div>
      <div className="mb-3 flex flex-col space-y-3">
        {mapState === "countries" && <CountryMapsCarousel />}

        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </div>
  );
}
