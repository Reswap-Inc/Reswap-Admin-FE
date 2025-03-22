import axios from "axios";
import { CHANGE_PASSWORD, FORGOT_PASSWORD_EMAIL, LOGIN, REGISTRATION, RESET_PASSWORD_EMAIL,cookies } from "../config/endpoints";

export const userRegistration = async ({ formData }) => {
  try {
    const response = await axios.post(REGISTRATION, formData, {
      headers: {
        Cookie: cookies 
      },
      withCredentials: true, // Required to send cookies in React Native
    });

    if (response.status !== 200) {
      throw new Error(
        response.data?.message || "Registration failed. Please try again."
      );
    }

    return response.data;
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

export const userLogin = async ({ formData }) => {
  try {
    const response = await axios.post(LOGIN, formData, {
      headers: {
        Cookie: cookies 
      },
      withCredentials: true, // Required to send cookies in React Native
    });

    if (response.status !== 200) {
      throw new Error(
        response.data?.message || "Login failed. Please try again."
      );
    }

    return response.data;
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

export const userResetPassword = async ({ formData }) => {
  try {
    const response = await axios.post(RESET_PASSWORD_EMAIL, formData, {
      headers: {
        Cookie: cookies 
      },
      withCredentials: true, // Required to send cookies in React Native
    });

    if (response.status !== 200) {
      throw new Error(
        response.data?.message || "Reset failed. Please try again."
      );
    }

    return response.data;
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
export const userForgetPassword = async ({ formData }) => {
  try {
    const response = await axios.post(FORGOT_PASSWORD_EMAIL, formData, {
      headers: {
        Cookie: cookies 
      },
      withCredentials: true, // Required to send cookies in React Native
    });

    if (response.status !== 200) {
      throw new Error(
        response.data?.message || "Forget failed. Please try again."
      );
    }

    return response.data;
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
export const userChangePassword = async ({ formData }) => {
  try {
    const response = await axios.post(CHANGE_PASSWORD, formData, {
      headers: {
        Cookie: cookies 
      },
      withCredentials: true, // Required to send cookies in React Native
    });

    if (response.status !== 200) {
      throw new Error(
        response.data?.message || "Forget failed. Please try again."
      );
    }

    return response.data;
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