import axios from "axios";
import { LOGOUT } from "../redux/endpoint";
import { handleLogin } from "../utils/useRedirect";

export const userLogout = async () => {
  try {
    // Call logout API to let server clear HttpOnly cookies
    const response = await axios.get(LOGOUT, {
      withCredentials: true, // Very important to send cookies
      validateStatus: (status) => status < 400,
    });

    console.log("Logout response:", response);

    // Clear local/session storage (client-side tokens)
    localStorage.clear();
    sessionStorage.clear();

    // Clear any non-HttpOnly cookies (if any)
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.trim().split("=")[0];
      document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    });

    // Redirect to login
    window.location.href = "/login";
  } catch (error) {
    handleLogin(error);
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || "Something went wrong.");
    } else {
      throw new Error("An unexpected error occurred. Please try again.");
    }
  }
};
