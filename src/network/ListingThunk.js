import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import {
  ADD_LISTING,
  cookies,
  DELETE_LISTING,
  EDIT_LISTING,
  GET_LISTING,
  LISTING_APPROVE,
  SEARCH_SPACE_LISTING,
} from "../redux/endpoint";
import { toast } from "react-toastify";
import { handleLogin } from "../utils/useRedirect";


export const getListingThunk = createAsyncThunk(
  "listing/getListing",
  async (listingId) => {
    try {
      const response = await axios.get(`${GET_LISTING}?listingId=${listingId}`, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      handleLogin(error)
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
      handleLogin(error)
      return rejectWithValue(handleAxiosError(error));
    }
  }
);

export const addListingFunction = async ( formData ) => {
  
  try {
    const response = await axios.post(ADD_LISTING, formData,{
      withCredentials: true, // ✅ Ensures cookies are sent with the request
    });
    return response;
  } catch (error) {
    handleLogin(error)
    if (error.response) {
      console.error("apiaddlist",error)
      throw error.response.data.status.message||error; // ✅ Throw the error instead of returning it
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
};
export const updateListingFunction = async (formData) => {
  console.log("apiaddlist", formData);

  try {
    const response = await axios.post(EDIT_LISTING, formData, {
      withCredentials: true, // ✅ Ensures cookies are sent with the request
    });

    console.log(response, "responseUday");
    return response;
  } catch (error) {
    handleLogin(error)
    if (error.response) {
      // ✅ Extract actual error message from API response
      const errorMessage =
        error.response.data.status.message||error;

      console.error("API Error:", errorMessage);
      throw new Error(errorMessage); // ✅ Throw actual API error message
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

      handleLogin(response)
     
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
      handleLogin(error)
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
export const approveListing = createAsyncThunk(
  "listingapprove/approveAlllisting",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("Fetching listings...");

      const response = await axios.post( LISTING_APPROVE, formData, {
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
      handleLogin(error)
      console.error("❌ Error fetching listings:", error);
return error
      // Extra logging to debug axios errors
     
     
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
      handleLogin(response)
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
      handleLogin(response)
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
    console.error(
      "Axios error:",
      error.response?.data?.message || error.message
    );
    return error.response?.data?.message || "Something went wrong.";
  } else {
    return "An unexpected error occurred. Please try again.";
  }
};
