import { createSlice } from "@reduxjs/toolkit";
import { getListingThunk, addListingThunk, updateListingThunk, deleteListingThunk } from "../../network/ListingThunk";

const listingSlice = createSlice({
  name: "listing",
  initialState: {
    listings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getListingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(getListingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addListingThunk.fulfilled, (state, action) => {
        state.listings.push(action.payload);
      })
      .addCase(updateListingThunk.fulfilled, (state, action) => {
        const index = state.listings.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.listings[index] = action.payload;
        }
      })
      .addCase(deleteListingThunk.fulfilled, (state, action) => {
        state.listings = state.listings.filter((item) => item.id !== action.payload.id);
      });
  },
});

export default listingSlice.reducer;
