import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { TravelingProvider } from "./context/TravelingContext.jsx";
import { SidebarProvider } from "./context/SidebarContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <TravelingProvider>
          <App />
        </TravelingProvider>
      </SidebarProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
