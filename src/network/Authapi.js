import axios from "axios";
import { LOGOUT, PROFILE } from "../redux/endpoint";
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






export const getProfile = createAsyncThunk("profile/get", async (_, thunkAPI) => {
  try {
    const response = await axios.get(PROFILE, {
      withCredentials: true,
    });
    console.log("respose profile++++++=============",response)
    return response
  } catch (error) {
    handleLogin(error);
    return thunkAPI.rejectWithValue(error.response?.data || "Unknown error");
  }
});