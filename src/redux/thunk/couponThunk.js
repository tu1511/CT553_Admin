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
