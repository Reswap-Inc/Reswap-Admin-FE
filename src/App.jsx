import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ListingDetails from './pages/ListingDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/listing-details/:listingId" element={<ListingDetails />} />
      </Routes>
    </Router>
  );
};

export default App; 