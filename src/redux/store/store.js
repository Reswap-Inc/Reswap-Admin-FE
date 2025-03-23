import { configureStore } from "@reduxjs/toolkit";
import listingSlice from "../slices/ListingSlice"
import AllListingSlice from "../slices/GetSearchAllListingSpcSlice"
import  AllUserSlice from "../slices/GetAllUserSlices"

const store = configureStore({
  reducer: {
   listing:listingSlice,
   AllListingSlice:AllListingSlice
   , AllUserSlice: AllUserSlice
  },
});

export default store;
