import React, { useEffect } from "react";
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
import { messaging } from './utils/firebaseConfig.js';
import { getToken } from 'firebase/messaging';




const App = () => {
  const requestPermission = async () => {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey:'BOb7dqz6blHs1j3Kfv8R2aKXanJnne5LAR7zSGRvIWyLBStfhTQ6gO4DgmCdksHm-htPKp3DKu509REy3VB9gZs'
      });
      if (currentToken) {
        console.log('FCM Token:', currentToken);
        // Send token to your server to send notifications later
      } else {
        console.warn('No registration token available. Request permission to generate one.');
      }
    } catch (err) {
      console.error('An error occurred while retrieving token. ', err);
    }
  };
  
  useEffect(() => {
    requestPermission();
  }, []);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/web/admin/home" replace />}
          />

          {/* Login route without Navbar */}
          <Route path="/web/admin/login" element={<LoginPage />} />

          {/* Protected routes with Navbar */}
          <Route
            path="/web/admin/"
            element={
              <>
                <Navbar />
                <Layout />
              </>
            }
          >
            <Route index element={<Navigate to="/login" replace />} />
            <Route path="home" element={<ListingOutlet />}>
              <Route index element={<Listing />} />{" "}
              {/* ✅ Default component for /listings */}
              <Route path="add-listing" element={<AddListing />} />{" "}
              <Route path="edit-listing" element={<AddListing />} />{" "}
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
            <Route path="*" element={<Navigate to="/web/admin/home" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
