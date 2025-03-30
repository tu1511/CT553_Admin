import { createAsyncThunk } from "@reduxjs/toolkit";
import accountService from "@services/account.service";
import authService from "@services/auth.service";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = (await authService.login(credentials)).data;

      localStorage.setItem(
        "accessToken",
        response?.metadata.tokens.accessToken
      );

      return response;
    } catch (error) {
      console.log("Lỗi khi đăng nhập:", error.data.message);
      return rejectWithValue(error.data.message);
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.register(data);
      return response.data;
    } catch (error) {
      console.log("Lỗi khi đăng ký:", error.response.data.error);
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getLoggedInUserThunk = createAsyncThunk(
  "account/getLoggedInUser",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await accountService.getLoggedInUser(accessToken);

      console.log("response", response);
      return response;
    } catch (error) {
      console.log(
        "Lỗi khi lấy thông tin người dùng:",
        error.response.data.error
      );
      return rejectWithValue(error.response.data.error);
    }
  }
);
