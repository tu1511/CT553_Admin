import { createAsyncThunk } from "@reduxjs/toolkit";
import reviewService from "@services/review.service";

export const getAllReviews = createAsyncThunk(
  "review/getAllReviews",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await reviewService.getAll(accessToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const replyComment = createAsyncThunk(
  "review/replyComment",
  async ({ accessToken, data }, { rejectWithValue }) => {
    try {
      const response = await reviewService.replyComment(accessToken, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.data?.message);
    }
  }
);
