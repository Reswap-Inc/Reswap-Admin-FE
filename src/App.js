import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Categories from "./pages/Listing.jsx";
import AddForm from "./pages/Addform.js";
import LoginPage from "./pages/LoginPage/LoginPage";
import Layout from "./components/Layout";
import ChatApp from './pages/Chatapp.js';
import PropertyDetail from "./pages/ListingDetails.js";
import AddUser from "./pages/Adduser.js";
import Usermanagement from "./pages/Usermanagement.js";
import UserProfile from "./pages/UserProfile.js";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Redirect root path "/" to "/reswap/web/admin/home" */}
          <Route path="/" element={<Navigate to="/reswap/web/admin/home" replace />} />

          {/* Login route without Navbar */}
          <Route path="/reswap/web/admin/login" element={<LoginPage />} />

          {/* Protected routes with Navbar */}
          <Route path="/reswap/web/admin/" element={
            <>
              <Navbar />
              <Layout />
            </>
          }>
            {/* Redirect index route under /reswap/web/admin/ to home */}
            <Route index element={<Navigate to="/reswap/web/admin/home" replace />} />

            <Route path="home" element={<Categories />} />
            <Route path="addform" element={<AddForm />} />
            <Route path="adduser" element={<AddUser />} />
            <Route path="user" element={<Usermanagement />} />
            <Route path="user-profile" element={<UserProfile />} />
            <Route path="listing-details/:listingId" element={<PropertyDetail />} />
            <Route path="admin-chat" element={<ChatApp />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
