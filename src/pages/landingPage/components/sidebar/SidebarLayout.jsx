import React from "react";
import Sidebar from "./Sidebar";

export default function SidebarLayout({ children }) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}
