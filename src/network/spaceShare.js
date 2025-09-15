import axios from "axios";
import { GET_PLACE_NEAR_LISTING } from "../redux/endpoint";

export const getPlacesNearListing = async (addressFormData) => {
  try {
    const response = await axios.get(`${GET_PLACE_NEAR_LISTING}`, {
      params: addressFormData, // Attach the object as query params
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
