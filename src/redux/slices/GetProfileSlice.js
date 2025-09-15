
import { createSlice } from "@reduxjs/toolkit";
import {getProfile } from "../../network/Authapi";

const getProfileSlice = createSlice({
  name: "getProfileSlice",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        // console.log('--PROFILE-SLICE-SUC--', action.payload)
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(getProfile.rejected, (state, action) => {
        // console.log('--PROFILE-SLICE-REJ--', action.payload)
        state.loading = false;
        state.error = action.payload;
        state.data=[]
      })
      
  },
});

export default getProfileSlice.reducer;
