import { configureStore } from "@reduxjs/toolkit";
import listingSlice from "../slices/ListingSlice"
import AllListingSlice from "../slices/GetSearchAllListingSpcSlice"
import AllUserSlice from "../slices/GetAllUserSlices"
import getProfileSlice from "../slices/GetProfileSlice"
import notificationReducer from '../slices/NotificationSlice';

const store = configureStore({
  reducer: {
    listing: listingSlice,
    AllListingSlice: AllListingSlice,
    AllUserSlice: AllUserSlice,
    getProfileSlice: getProfileSlice,
    notification: notificationReducer,
  },
});

export default store;
