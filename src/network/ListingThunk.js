import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  ADD_LISTING,
  cookies,
  DELETE_LISTING,
  EDIT_LISTING,
  GET_LISTING,
  SEARCH_SPACE_LISTING,
} from "../redux/endpoint";


export const getListingThunk = createAsyncThunk(
  "listing/getListing",
  async (listingId) => {
    try {
      const response = await axios.get(`${GET_LISTING}?listingId=${listingId}`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

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

export const addListingFunction = async ( formData ) => {
  console.log("apiaddlist",formData)
  try {
    const response = await axios.post(ADD_LISTING, formData,{
      withCredentials: true, // ✅ Ensures cookies are sent with the request
    });
    return response;
  } catch (error) {
    if (error.response) {
      throw error; // ✅ Throw the error instead of returning it
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
};
export const updateListingFunction = async ( formData ) => {
  console.log("apiaddlist",formData)
  try {
    const response = await axios.put(EDIT_LISTING, formData,{
      withCredentials: true, // ✅ Ensures cookies are sent with the request
    });
    return response;
  } catch (error) {
    if (error.response) {
      throw error; // ✅ Throw the error instead of returning it
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
};

export const getSearchAlllisting = createAsyncThunk(
  "listing/getSearchAlllisting",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("Fetching listings...");

      const response = await axios.post(SEARCH_SPACE_LISTING, formData, {
        withCredentials: true,
        validateStatus: (status) => status < 400, // Accept all success and redirect statuses
      });

      console.log("Response received:", response?.data, response.headers);

      // Handle Redirects (302)
      if (response.status == 302 && response.headers.location) {
        const redirectUrl = response.headers.location;
        console.log("Redirecting to:", redirectUrl);

        const redirectResponse = await axios.get(redirectUrl, {
          withCredentials: true,
        });

        console.log("Redirect Response Data:", redirectResponse?.data);
        return redirectResponse.data;
      }

      return response.data;
    } catch (error) {
      console.error("❌ Error fetching listings:", error);

      // Extra logging to debug axios errors
      if (axios.isAxiosError(error)) {
        console.error("🛑 Axios error details:", {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers,
        });
      } else {
        console.error("❌ Unknown error occurred", error);
      }

      return rejectWithValue(
        "An error occurred while fetching data."
      );
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
    console.error(
      "Axios error:",
      error.response?.data?.message || error.message
    );
    return error.response?.data?.message || "Something went wrong.";
  } else {
    return "An unexpected error occurred. Please try again.";
  }
};
