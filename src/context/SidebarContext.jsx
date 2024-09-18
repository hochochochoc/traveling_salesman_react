"use client";

import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export function SidebarProvider({ children }) {
  const [isSidebarFunctional, setIsSidebarFunctional] = useState(false);

  const toggleSidebarFunctionality = () => {
    setIsSidebarFunctional((prev) => !prev);
  };

  return (
    <SidebarContext.Provider
      value={{ isSidebarFunctional, toggleSidebarFunctionality }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
