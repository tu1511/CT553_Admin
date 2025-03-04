import { createAsyncThunk } from "@reduxjs/toolkit";
import couponService from "@services/coupon.service";

export const getAllCoupons = createAsyncThunk(
  "coupon/getAllCoupons",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await couponService.getAll(accessToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCoupon = createAsyncThunk(
  "coupon/createCoupon",
  async ({ accessToken, data }, { rejectWithValue }) => {
    try {
      const response = await couponService.create(accessToken, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "coupon/updateCoupon",
  async ({ accessToken, couponId, data }, { rejectWithValue }) => {
    try {
      const response = await couponService.update(accessToken, couponId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "coupon/deleteCoupon",
  async ({ accessToken, couponId }, { rejectWithValue }) => {
    try {
      const response = await couponService.delete(accessToken, couponId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
