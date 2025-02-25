import { createAsyncThunk } from "@reduxjs/toolkit";
import productService from "@services/product.service";

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async ({ limit = 300, type = "All" } = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts({ limit, type });

      // console.log("data", response);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async ({ accessToken, product }, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(accessToken, product);
      console.log("response", response);
      return response;
    } catch (error) {
      console.log(error.data.message);
      return rejectWithValue(error.data.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ product, accessToken }, { rejectWithValue }) => {
    try {
      const response = await productService.updateProduct(accessToken, product);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// update discounts
export const updateDiscounts = createAsyncThunk(
  "products/updateDiscounts",
  async (
    { accessToken, productId, discountValue, startDate, endDate },
    { rejectWithValue }
  ) => {
    try {
      const response = await productService.updateDiscounts(
        accessToken,
        productId,
        discountValue,
        startDate,
        endDate
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// create product discount
export const createProductDiscount = createAsyncThunk(
  "products/createProductDiscount",
  async (
    { accessToken, productId, discountValue, startDate, endDate },
    { rejectWithValue }
  ) => {
    try {
      const response = await productService.createProductDiscount(
        accessToken,
        productId,
        discountValue,
        startDate,
        endDate
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// create category for product
export const createCategory = createAsyncThunk(
  "products/createCategory",
  async ({ accessToken, productId, categoryId }, { rejectWithValue }) => {
    try {
      const response = await productService.createCategoryForProduct(
        accessToken,
        productId,
        categoryId
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// delete category for product
export const deleteCategory = createAsyncThunk(
  "products/deleteCategory",
  async ({ accessToken, productId, categoryId }, { rejectWithValue }) => {
    try {
      const response = await productService.deleteCategoryForProduct(
        accessToken,
        productId,
        categoryId
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// add image for product
export const addImage = createAsyncThunk(
  "products/addImage",
  async ({ accessToken, productId, uploadedImageId }, { rejectWithValue }) => {
    try {
      const response = await productService.addImageForProduct(
        accessToken,
        productId,
        uploadedImageId
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// delete image for product
export const deleteImage = createAsyncThunk(
  "products/deleteImage",
  async ({ accessToken, productId, productImageId }, { rejectWithValue }) => {
    try {
      const response = await productService.deleteImageForProduct(
        accessToken,
        productId,
        productImageId
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// export const deleteProduct = createAsyncThunk(
//   "products/deleteProduct",
//   async (id, { rejectWithValue }) => {
//     try {
//       await productsService.deleteProduct(id);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );
