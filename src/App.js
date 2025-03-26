import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Listing from "./pages/Listing.jsx";
import AddListing from "./pages/AddListing.js";
import LoginPage from "./pages/LoginPage/LoginPage";
import Layout from "./components/Layout";

// import ForgotPasswordLinkPage from "./pages/LoginPage/ForgotPasswordLinkPage.js";
// import ResetLinkSentPage from "./pages/LoginPage/ResetLinkSentPage.js";
import ChatApp from "./pages/Chatapp.js";
import ListingDetails from "./pages/ListingDetails.js";
import AddUser from "./pages/Adduser.js";
import Usermanagement from "./pages/Usermanagement.js";
import UserProfile from "./pages/UserProfile.js";
import ListingOutlet from "./components/ListingOutlet.jsx";
// import sdk from "matrix-js-sdk";
// import MatrixChat from "matrix-react-sdk/lib/components/structures/MatrixChat";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/reswap/web/admin/listings" replace />}
          />

          {/* Login route without Navbar */}
          <Route path="/reswap/web/admin/login" element={<LoginPage />} />

          {/* Protected routes with Navbar */}
          <Route
            path="/reswap/web/admin/"
            element={
              <>
                <Navbar />
                <Layout />
              </>
            }
          >
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="listings" element={<ListingOutlet />}>
              <Route index element={<Listing />} />{" "}
              {/* ✅ Default component for /listings */}
              <Route path="add-listing" element={<AddListing />} />{" "}
              {/* ✅ Relative path */}
              <Route
                path="listing-details/:listingId"
                element={<ListingDetails />}
              />{" "}
              {/* ✅ Relative path */}
            </Route>

            {/* <Route path="/user" element={<Usermanagement />}>
              <Route path="adduser" element={<AddUser />} />{" "}
              <Route path="user-profile" element={<UserProfile />} />{" "}
            </Route> */}

            <Route path="adduser" element={<AddUser />} />
            <Route path="user" element={<Usermanagement />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="admin-chat" element={<ChatApp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
