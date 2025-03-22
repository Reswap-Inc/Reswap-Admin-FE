import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  return (
    <div>
      <section style={{ display: "flex", alignItems: "stretch" }}>
        <div className="w-[20%] ">
          <Sidebar />
        </div>
        <div className="w-full p-2">
          <Outlet />
        </div>
      </section>
    </div>
  );
}
