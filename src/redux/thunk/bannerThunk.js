import { createAsyncThunk } from "@reduxjs/toolkit";
import bannerService from "@services/banner.service";

export const getAllBanners = createAsyncThunk(
  "banner/getAllBanners",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await bannerService.getAll(accessToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getAdminBanners = createAsyncThunk(
  "banner/getAdminBanners",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await bannerService.getAdmin(accessToken);
      console.log("response:", response?.metadata);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createBanner = createAsyncThunk(
  "banner/createBanner",
  async ({ accessToken, data }, { rejectWithValue }) => {
    try {
      const response = await bannerService.create(accessToken, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateBanner = createAsyncThunk(
  "banner/updateBanner",
  async ({ accessToken, id, data }, { rejectWithValue }) => {
    try {
      const response = await bannerService.update(accessToken, id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteBanner = createAsyncThunk(
  "banner/deleteBanner",
  async ({ accessToken, bannerId }, { rejectWithValue }) => {
    try {
      const response = await bannerService.delete(accessToken, bannerId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
