import { createSlice } from "@reduxjs/toolkit";
import { getListingThunk, addListingThunk, updateListingThunk, deleteListingThunk } from "../../network/ListingThunk";

const listingSlice = createSlice({
  name: "listing",
  initialState: {
    detail: null,
    meta: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListingThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.meta = null;
      })
      .addCase(getListingThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.detail = action.payload?.body ?? null;
        state.meta = action.payload?.status ?? null;
      })
      .addCase(getListingThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Failed to fetch listing";
        state.detail = null;
        state.meta = null;
      })
      .addCase(addListingThunk.fulfilled, (state, action) => {
        state.detail = action.payload?.body ?? state.detail;
        state.meta = action.payload?.status ?? state.meta;
      })
      .addCase(updateListingThunk.fulfilled, (state, action) => {
        // If we already have the same listing loaded, refresh it with the latest payload (if available)
        if (state.detail && action.payload?.body && action.payload.body?.listingId === state.detail.listingId) {
          state.detail = action.payload.body;
        }
      })
      .addCase(deleteListingThunk.fulfilled, (state, action) => {
        state.detail = null;
        state.meta = null;
      });
  },
});

export default listingSlice.reducer;
