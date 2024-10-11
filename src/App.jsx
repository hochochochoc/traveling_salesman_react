import React from "react";
import MenuPage from "./pages/landingPage/MenuPage";
import MapPage from "./pages/mapPage/MapPage";
import DemosPage from "./pages/demosPage/DemosPage";
import ResultsPage from "./pages/resultsPage/ResultsPage";
import LandingPage from "./pages/destinationPage/LandingPage";
import { Route, Routes } from "react-router-dom";
import { DemosProvider } from "./pages/demosPage/context/GraphContext";
import "./index.css";
import { MapPageProvider } from "./pages/mapPage/context/MapPageContext";

// import { AuthProvider } from "./context/authContext";

// import ProtectedRoute from "./components/utils/ProtectedRoute.jsx";

function App() {
  return (
    // <AuthProvider>
    <Routes>
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/" element={<MenuPage />} />
      <Route
        path="/map"
        element={
          <MapPageProvider>
            <MapPage />
          </MapPageProvider>
        }
      />
      <Route
        path="/demos"
        element={
          <DemosProvider>
            <DemosPage />
          </DemosProvider>
        }
      />
      <Route path="/results" element={<ResultsPage />} />
      {/* <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> */}
    </Routes>
    // </AuthProvider>
  );
}

export default App;
