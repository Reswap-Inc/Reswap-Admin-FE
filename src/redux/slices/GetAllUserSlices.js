
import { createSlice } from "@reduxjs/toolkit";
import {getAllUserThunk } from "../../network/GetAllUser";

const AllUserSlice = createSlice({
  name: "AllUser",
  initialState: {
    listings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUserThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(getAllUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
  },
});

export default AllUserSlice.reducer;
