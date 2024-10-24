import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { TravelingProvider } from "./context/TravelingContext.jsx";
import "./i18n/i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <TravelingProvider>
        <App />
      </TravelingProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
