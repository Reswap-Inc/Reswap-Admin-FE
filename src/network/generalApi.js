import axios from "axios";


import { createAsyncThunk } from '@reduxjs/toolkit';

import { 
  REGISTRATION_DEVICES,
  GET_ALL_NOTIFICATION,
  SEE_NOTIFICATION,
  DELETE_NOTIFICATION,
  DELETE_DEVICES,GET_CONFIGURATION, GET_LOCATION_FROM_ZIP
} from '../redux/endpoint';
import { handleLogin } from "../utils/useRedirect";
export const getConfiguration = async (configKey) => {
  try {
    const response = await axios.get(`${GET_CONFIGURATION}=${configKey}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    handleLogin(error)
    throw error;
  }
};

export const getLocationFromZip = async (zipCode) => {
  try {
    const response = await axios.get(`${GET_LOCATION_FROM_ZIP}=${zipCode}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {handleLogin(error)
    throw error;
  }
};




// Register a Device
export const registerDevice = createAsyncThunk(
  'notification/registerDevice',
  async (deviceData, thunkAPI) => {
    try {
      const response = await axios.post(REGISTRATION_DEVICES, deviceData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleLogin(error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get All Notifications
export const getAllNotifications = createAsyncThunk(
  'notification/getAll',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(GET_ALL_NOTIFICATION, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleLogin(error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Get Unread Notifications Count
export const getUnreadNotificationsCount = createAsyncThunk(
  'notification/getUnreadCount',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${GET_ALL_NOTIFICATION}?unread=true`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleLogin(error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Mark Notification as Seen
export const seeNotification = createAsyncThunk(
  'notification/see',
  async (notificationId, thunkAPI) => {
    try {
      const response = await axios.post(SEE_NOTIFICATION, { notifications: [notificationId] }, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleLogin(error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a Notification
export const deleteNotification = createAsyncThunk(
  'notification/delete',
  async (notificationId, thunkAPI) => {
    try {
      const response = await axios.delete(DELETE_NOTIFICATION, { 
        data: { notifications: [notificationId] },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleLogin(error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete a Device
export const deleteDevice = createAsyncThunk(
  'notification/deleteDevice',
  async (deviceId, thunkAPI) => {
    try {
      const response = await axios.post(DELETE_DEVICES, { deviceId }, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      handleLogin(error);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);
