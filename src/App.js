import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import AuthWrapper from "./components/AuthWrapper";

import ListingOutlet from "./components/ListingOutlet";
import Listing from "./pages/Listing";
import AddListing from "./pages/AddListing";
import ListingDetails from "./pages/ListingDetails";
import AddListing11 from "./pages/rough";

import AddUser from "./pages/AddUser";
import Usermanagement from "./pages/Usermanagement";
import UserProfile from "./pages/UserProfile";
import ChatApp from "./pages/Chatapp";
import LoginPage from "./pages/LoginPage/LoginPage";
import NotificationPage from "./pages/NotificationPage";

import { messaging } from './utils/firebaseConfig';
import { getToken } from 'firebase/messaging';
  import firebaseNotificationService from './utils/firebaseNotificationService';

// const App = () => {
//   useEffect(() => {
//     const requestPermission = async () => {
//       try {
//         const currentToken = await getToken(messaging, {
//           vapidKey: 'BOb7dqz6blHs1j3Kfv8R2aKXanJnne5LAR7zSGRvIWyLBStfhTQ6gO4DgmCdksHm-htPKp3DKu509REy3VB9gZs',
//         });
//         if (currentToken) {
//           console.log('FCM Token:', currentToken);
//           // TODO: Send token to your server
//         } else {
//           console.warn('No registration token available. Request permission to generate one.');
//         }
//       } catch (err) {
//         console.error('An error occurred while retrieving token.', err);
//       }
//     };

//     requestPermission();
//   }, []);


const App = () => {
  useEffect(async () => {
    console.log('🚀 App.js - Initializing Firebase notification service');
    
    // Initialize Firebase notification service
    // await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    //  console.log('🚀 Service Worker registered successfully');

    firebaseNotificationService.initialize().then((token) => {
      if (token) {
        console.log('🚀 FCM Token obtained:', token);
        // TODO: Send token to your server
      }
    });

    // Cleanup on unmount
    return () => {
      firebaseNotificationService.cleanup();
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/web/admin/home" replace />} />

        {/* Public Routes */}
        <Route path="/web/admin/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/web/admin/"
          element={
            <>
              <Navbar />
              <AuthWrapper />
            </>
          }
        >
          {/* Admin Dashboard */}
          <Route index element={<Navigate to="home" replace />} />

          {/* Listing Management */}
          <Route path="home" element={<ListingOutlet />}>
            <Route index element={<Listing />} />
            <Route path="add-listing" element={<AddListing />} />
            <Route path="edit-listing/:id" element={<AddListing />} />
            <Route path="appdata" element={<AddListing11 />} />
            <Route path="listing-details/:listingId" element={<ListingDetails />} />
          </Route>

          {/* User Management */}
          <Route path="users" element={<Usermanagement />} />
          <Route path="users/add" element={<AddUser />} />
          {/* <Route path="users/profile" element={<UserProfile />} /> */}

          {/* Chat */}
          <Route path="admin-chat" element={<ChatApp />} />

          {/* Notifications */}
          <Route path="notifications" element={<NotificationPage />} />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/web/admin/home" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
