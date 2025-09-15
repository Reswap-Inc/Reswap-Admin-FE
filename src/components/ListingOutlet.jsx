import React from "react";
import { Outlet } from "react-router-dom";

const ListingOutlet = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

export default ListingOutlet;
