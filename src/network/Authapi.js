import axios from "axios";
// import { CHANGE_PASSWORD, FORGOT_PASSWORD_EMAIL, LOGIN, REGISTRATION, RESET_PASSWORD_EMAIL,cookies } from "../config/endpoints";
import { LOGOUT } from "../redux/endpoint";


export const userLogout = async () => {
  try {
    const response = await axios.get(LOGOUT, {
      withCredentials: true,
      validateStatus: (status) => status < 400, // Allow redirects
    });

    console.log("Logout response:", response);

    // Handle Redirect Based on API Response
    if (response.status === 302 && response.headers.location) {
      console.log("Redirecting to:", response.headers.location);
      window.location.href = response.headers.location; // Use the actual redirect URL
      window.location.href = "reswap/web/admin/user";
      return;
    }

    // If no redirect is provided, fallback to a default page
    return response
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Axios error:",
        error.response?.data?.message || error.message
      );
      throw new Error(error.response?.data?.message || "Something went wrong.");
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};


