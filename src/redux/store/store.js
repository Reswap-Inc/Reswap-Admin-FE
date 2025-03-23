import { configureStore } from "@reduxjs/toolkit";
import listingSlice from "../slices/ListingSlice"
import AllListingSlice from "../slices/GetSearchAllListingSpcSlice"

const store = configureStore({
  reducer: {
   listing:listingSlice,
   AllListingSlice:AllListingSlice
  },
});

export default store;
