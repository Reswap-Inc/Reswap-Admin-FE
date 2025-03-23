import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getListingThunk } from '../network/ListingThunk';

const ListingDetails = () => {
  const { listingId } = useParams();
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (listingId) {
      dispatch(getListingThunk(listingId));
    }
  }, [dispatch, listingId]);

  // ... rest of your component code
};

export default ListingDetails; 