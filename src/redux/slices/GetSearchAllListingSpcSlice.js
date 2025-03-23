
import { createSlice } from "@reduxjs/toolkit";
import {getSearchAlllisting } from "../../network/ListingThunk";

const AllListingSlice = createSlice({
  name: "AllListing",
  initialState: {
    listings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getSearchAlllisting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSearchAlllisting.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(getSearchAlllisting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});

export default AllListingSlice.reducer;
