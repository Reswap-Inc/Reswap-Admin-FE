import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  MdDashboard,
  MdPeople,
  MdTrackChanges,
  MdManageAccounts,
  MdAssessment,
  MdPayments,
  MdApproval,
  MdCampaign,
  MdBusinessCenter,
  MdChat,
  MdGavel,
  MdFeedback,
} from "react-icons/md";

import { navItems } from "../data/navConfig";

const Sidebar = () => {
  const location = useLocation();


  const activeLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-white bg-maincolor text-md m-2";
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-maincolor bg-white m-2";

  return (
    <div className="h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto bg-white">
      <div>
        {navItems.map((link) => (
          <div key={link.title}>
            {/* Main menu link */}
            <NavLink
              to={link.path}
              style={({ isActive }) => ({
                backgroundColor:
                  isActive ||
                  (link.path === "/customers"&&link.title=="listing" ) ||
                  (link.path === "/addform"&&link.title=="listing" )
                    ? "#03311E"
                    : "",
                color:
                  isActive ||
                  (link.path === "/customers"&&link.title=="listing" ) ||
                  (link.path === "/addform"&&link.title=="listing" )
                    ? "white"
                    : "#03311E",
              })}
              className={({ isActive }) =>
                isActive ||
              (link.path === "/customers"&&link.title=="listing" ) ||
                  (link.path === "/addform"&&link.title=="listing" )
                  ? activeLink
                  : normalLink
              }
            >
              <link.icon />
              <span className="capitalize">{link.title}</span>
            </NavLink>

          
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
