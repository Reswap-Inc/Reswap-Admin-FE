import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";


import Categories from "./pages/Categories";
import AddForm from "./pages/Addform.js";
import LoginPage from "./pages/LoginPage/LoginPage";
import Layout from "./components/Layout";

// import ForgotPasswordLinkPage from "./pages/LoginPage/ForgotPasswordLinkPage.js";
// import ResetLinkSentPage from "./pages/LoginPage/ResetLinkSentPage.js";
import ChatApp from './pages/Chatapp.js';
import PropertyDetail from "./pages/ListingDetails.js";
import AddUser from "./pages/Adduser.js";
import Usermanagement from "./pages/Usermanagement.js";
import UserProfile from "./pages/UserProfile.js";
// import sdk from "matrix-js-sdk";
// import MatrixChat from "matrix-react-sdk/lib/components/structures/MatrixChat";


const App = () => {
  
  return (
    <div>
      <BrowserRouter>
        <Routes>
          {/* Login routes without Navbar */}
          <Route path="/login" element={<LoginPage />} />
          {/* <Route path="/forgot-password" element={<ForgotPasswordLinkPage />} />
          <Route path="/forgot-password-link" element={<ResetLinkSentPage />} /> */}

          {/* Protected routes with Navbar */}
          <Route path="/" element={
            <>
              <Navbar />
              <Layout />
            </>
          }>
            <Route index element={<Navigate to="/login" replace />} />
            
            <Route path="/customers" element={<Categories />} />
            <Route path="/addform" element={<AddForm />} />
            <Route path="/adduser" element={<AddUser />} />
            <Route path="/user" element={<Usermanagement />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/listing-details" element={<PropertyDetail />} />
            
            <Route path="/admin-chat" element={<ChatApp />} />
            
            
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
