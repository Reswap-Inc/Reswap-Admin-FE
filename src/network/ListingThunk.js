import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ADD_LISTING, cookies, DELETE_LISTING, EDIT_LISTING, GET_LISTING } from "../redux/endpoint";

/**
 * Get Listings Thunk
 */
export const getListingThunk = createAsyncThunk( 
    "listing/get",
    async (_, { rejectWithValue }) => {
      try {
        const response = await axios.get(GET_LISTING, {
         
          withCredentials: true, 
        });
  
        return response.data;
      } catch (error) {
        return rejectWithValue(handleAxiosError(error));
      }
    }
  );
  

/**
 * Add Listing Thunk
 */
export const addListingThunk = createAsyncThunk(
  "listing/add",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(ADD_LISTING, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

/**
 * Update Listing Thunk
 */
export const updateListingThunk = createAsyncThunk(
  "listing/update",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.put(EDIT_LISTING, formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

/**
 * Delete Listing Thunk
 */
export const deleteListingThunk = createAsyncThunk(
  "listing/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${DELETE_LISTING}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

/**
 * Error Handling Utility
 */
const handleAxiosError = (error) => {
  if (axios.isAxiosError(error)) {
    console.error("Axios error:", error.response?.data?.message || error.message);
    return error.response?.data?.message || "Something went wrong.";
  } else {
    return "An unexpected error occurred. Please try again.";
  }
};
