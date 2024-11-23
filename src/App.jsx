import React from "react";
import MenuPage from "./pages/landingPage/MenuPage";
import MapPage from "./pages/mapPage/MapPage";
import DemosPage from "./pages/demosPage/DemosPage";
import LandingPage from "./pages/destinationPage/LandingPage";
import { Route, Routes } from "react-router-dom";
import { DemosProvider } from "./pages/demosPage/context/GraphContext";
import "./index.css";
import { MapPageProvider } from "./pages/mapPage/context/MapPageContext";
import { MapPageTSPProvider } from "./pages/mapPage/context/MapPageTSPContext";
import TutorialPage from "./pages/tutorialPage/TutorialPage";
import { AuthProvider } from "./auth/authContext";
import Login from "./auth/login/login";
import Register from "./auth/register/register";
import ProfilePage from "./pages/profilePage/ProfilePage";
// import ProtectedRoute from "./components/utils/ProtectedRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/tutorial" element={<TutorialPage />} />
        <Route
          path="/map"
          element={
            <MapPageProvider>
              <MapPageTSPProvider>
                <MapPage />
              </MapPageTSPProvider>
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
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
