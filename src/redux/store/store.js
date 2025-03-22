import { configureStore } from "@reduxjs/toolkit";
import listingSlice from "../slices/ListingSlice"

const store = configureStore({
  reducer: {
   listing:listingSlice
  },
});

export default store;
