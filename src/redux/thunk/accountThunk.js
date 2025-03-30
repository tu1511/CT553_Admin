import { createAsyncThunk } from "@reduxjs/toolkit";
import accountService from "@services/account.service";

// thunk for getting all account
export const getAllAccount = createAsyncThunk(
  "account/getAllAccount",
  async ({ limit = 10, page = -1, accessToken }, { rejectWithValue }) => {
    try {
      const response = await accountService.getAllAccount(
        limit,
        page,
        accessToken
      );

      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const getLoggedInUser = createAsyncThunk(
  "account/getLoggedInUser",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await accountService.getLoggedInUser(accessToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.response.data.error);
    }
  }
);

export const updateUserInfoThunk = createAsyncThunk(
  "account/updateUserInfo",
  async ({ updatedData, accessToken }, { rejectWithValue }) => {
    try {
      const response = await accountService.updateInformation(
        updatedData,
        accessToken
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Cập nhật thất bại");
    }
  }
);

export const changePasswordThunk = createAsyncThunk(
  "account/changePassword",
  async ({ passwordData, accessToken }, { rejectWithValue }) => {
    try {
      const response = await accountService.changePassword(
        passwordData,
        accessToken
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Cập nhật thất bại");
    }
  }
);

export const updateAccountThunk = createAsyncThunk(
  "account/updateAccount",
  async ({ id, data, accessToken }, { rejectWithValue }) => {
    try {
      const response = await accountService.updateAccount(
        id,
        data,
        accessToken
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Cập nhật thất bại");
    }
  }
);
