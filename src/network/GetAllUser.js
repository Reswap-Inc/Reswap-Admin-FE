import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ADD_LISTING, BAN_USER, cookies, DELETE_LISTING, EDIT_LISTING, GET_ALL_USER, GET_LISTING, SEARCH_SPACE_LISTING } from "../redux/endpoint";
import { handleLogin } from "../utils/useRedirect";

/**
 * Get Listings Thunk
 */
// export const getListingThunk = createAsyncThunk(
//   "listing/getListing",
//   async (listingId) => {
//     try {
//       const response = await axios.get(`${GET_LISTING}?listingId=${listingId}`, {
//         withCredentials: true,
//       });
//       return response.data;
//     } catch (error) {
//       handleLogin(error)
//       throw error;
//     }
//   }
// );

/**
 * Add Listing Thunk
 */
export const banUser = createAsyncThunk(
  "ban/addban",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(BAN_USER, formData);
      return response.data;
    } catch (error) {
      handleLogin(error)
      return rejectWithValue(handleAxiosError(error));
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
      handleLogin(error)
      return rejectWithValue(handleAxiosError(error));
    }
  }
);
// export const getSearchAlllisting = createAsyncThunk(
//   "listing/getSearchAlllisting",
//   async (formData, { rejectWithValue }) => {
//     try {
//       const response = await axios.post(SEARCH_SPACE_LISTING, formData);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(handleAxiosError(error));
//     }
//   }
// );

export const getAllUserThunk = createAsyncThunk(
  "User/getSearchAllUser",
  async (formData, { rejectWithValue }) => {
    try {
    //   console.log("Fetching listings...");

      const response = await axios.post(GET_ALL_USER, formData, {
        withCredentials: true, 
        // maxRedirects: 0, // Prevent Axios from auto-following redirects
        validateStatus: (status) => status < 400, // Accept all success and redirect statuses
      });

      console.log("Response received:", response?.data);

      // Handle Redirects (302)
      if (response.status.code === 302 && response.headers.location) {
        const redirectUrl = response.headers.location;
        console.log("Redirecting to:", redirectUrl);

        const redirectResponse = await axios.get(redirectUrl, {
          withCredentials: true, // Ensure authentication cookies are included
        });

        console.log("Redirect Response Data:", redirectResponse?.data);
        return redirectResponse.data;
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching listings:", error);
      handleLogin(error)
      // Handle errors better
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
      handleLogin(error)
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
      handleLogin(error)
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
