import axios from "axios";
import { LOGOUT, PROFILE, REDIRECT_LOGIN, CHANGE_PASSWORD } from "../redux/endpoint";
import { handleLogin } from "../utils/useRedirect";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { get } from "immutable";

const clearAllCookies = () => {
  const cookies = document.cookie.split(";");

  for (let cookie of cookies) {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    console.log(name,"cookiessname==================")
    // Clear cookie for all domain/path variants
    const domain = window.location.hostname;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${domain}`;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain}`;
  }
};

export const userLogout = async () => {
  try {
    const response = await fetch(LOGOUT, {
      method: 'GET', // Use a string here
      credentials: 'include', // This is the correct property for sending cookies
      // redirect: 'follow' // default value
    });

    // Optionally, handle the response if needed
    if (!response.ok) {
      throw new Error('Logout failed');
    }

    return await response.json(); // or response.text(), depending on what your backend sends
  } catch (error) {
    console.error('Logout Error:', error);
    throw error; // rethrow if you want to handle it where it's called
  }
};


// export const getProfile = createAsyncThunk("profile/get", async (_, thunkAPI) => {
//   try {
//     const response = await axios.get(PROFILE, {
//       withCredentials: true,
//       validateStatus: (status) => status < 300, // Don't auto-follow redirects
//     });
//     console.log('Santhosh-0:', response.status, response);
//     return response.data;
//   } catch (error) {
//     console.log('Santhosh-1--', error.response, error)
//     // Check if it's a redirect (30x status)
//     if (error.response?.status >= 300 && error.response?.status <= 400) {
//       console.log("Session expired - redirect detected:", error.response.status);
//       return thunkAPI.rejectWithValue({
//         status: error.response.status,
//         message: "Session expired"
//       });
//     }
    
//     // Handle other errors
//     handleLogin(error);
//     return thunkAPI.rejectWithValue(error.response?.data || "Unknown error");
//   }
// });

export const getProfile = createAsyncThunk("profile/get", async (_, thunkAPI) => {
  try {
    const response = await axios.get(PROFILE, {
      withCredentials: true,
      validateStatus: () => true, // Accept all responses
    });

    const contentType = response.headers['content-type'];
    console.log('Santhosh0: contentType: ', contentType, '---response:  ',response);
    console.log('Santhosh1: data: ', response.data, '---status:  ',response.status);

    if (contentType?.includes('text/html') && response.data?.includes('<title>Reswap')) {
      console.log('Santhosh: Session likely expired - HTML login page returned');

      return thunkAPI.rejectWithValue({
        status: 401,
        message: 'Session expired',
        htmlRedirect: true
      });
    } 
      //     // Check if it's a redirect (30x status)
    else if (response?.status >= 300 && response?.status <= 404) {
      console.log("Session expired - redirect detected:", response.status);
      return thunkAPI.rejectWithValue({
        status: response.status,
        message: "Session expired"
      });
    }

    return response.data;

  } catch (error) {
    console.log('Santhosh-Error:', error.response?.status);

    handleLogin(error);
    return thunkAPI.rejectWithValue(error.response?.data || "Unknown error");
  }
});


// export const getProfile = createAsyncThunk("profile/get", async (_, thunkAPI) => {
//   try {
//     const response = await fetch(PROFILE, {
//       method: 'GET',
//       credentials: 'include',
//       // redirect: 'follow', // default, just for clarity
//     });

//     // Check if redirected to login
//     const contentType = response.headers.get("content-type");

//     if (response.redirected || response.url.includes("/login")) {
//       console.warn("Redirected to login. Session expired.");
//       window.location.href = REDIRECT_LOGIN; // or your login route
//       return thunkAPI.rejectWithValue("Session expired");
//     }

//     if (!response.ok) {
//       const errorText = await response.text();
//       throw new Error(errorText || "Unknown error");
//     }

//     // If it's not JSON (e.g., HTML), likely session is invalid
//     if (!contentType || !contentType.includes("application/json")) {
//       console.warn("Non-JSON response. Likely session expired.");
//       window.location.href = REDIRECT_LOGIN;
//       return thunkAPI.rejectWithValue("Session expired");
//     }

//     const data = await response.json();
//     return data;

//   } catch (error) {
//     console.error("Fetch error:", error);
//     window.location.href = REDIRECT_LOGIN; // fallback for unknown errors
//     return thunkAPI.rejectWithValue("Session expired or unknown error");
//   }
// });

// Change Password Function
export const changePassword = async (passwordData) => {
  try {
    // Get user email from sessionStorage or profile
    const userEmail = sessionStorage.getItem("userEmail") || passwordData.email;
    
    const requestBody = {
      id: userEmail,
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
      isNew: false // Set to false for regular password changes, true only for first-time setup
    };

    const response = await axios.post(CHANGE_PASSWORD, requestBody, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleLogin(error);
    if (error.response) {
      const errorMessage = error.response.data?.status?.message || error.message;
      console.error("Change Password API Error:", errorMessage);
      throw new Error(errorMessage);
    } else {
      throw new Error("Something went wrong. Please try again.");
    }
  }
};