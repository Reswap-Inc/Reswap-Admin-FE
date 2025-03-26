import axios from "axios";
import { GET_CONFIGURATION, GET_LOCATION_FROM_ZIP } from "../redux/endpoint";

export const getConfiguration = async (configKey) => {
  try {
    const response = await axios.get(`${GET_CONFIGURATION}=${configKey}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getLocationFromZip = async (zipCode) => {
  try {
    const response = await axios.get(`${GET_LOCATION_FROM_ZIP}=${zipCode}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
