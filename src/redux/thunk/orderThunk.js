import { createAsyncThunk } from "@reduxjs/toolkit";
import orderService from "@services/order.service";

export const getAllOrder = createAsyncThunk(
  "order/getAllOrder",
  async ({ accessToken, limit, page }, { rejectWithValue }) => {
    try {
      const response = await orderService.getAllOrder(accessToken, limit, page);
      //   console.log("Danh sách đơn hàng:", response);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
