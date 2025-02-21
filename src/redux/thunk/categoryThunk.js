import { createAsyncThunk } from "@reduxjs/toolkit";
import categoryService from "@services/category.service";

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryService.getAll();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (category, accessToken, { rejectWithValue }) => {
    try {
      const response = await categoryService.createCategory(
        category,
        accessToken
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, data, accessToken }, { rejectWithValue }) => {
    try {
      const response = await categoryService.updateCategory(
        id,
        data,
        accessToken
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// export const deleteCategory = createAsyncThunk(
//   "category/deleteCategory",
//   async (id, { rejectWithValue }) => {
//     try {
//       await categoryService.deleteCategory(id);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );
