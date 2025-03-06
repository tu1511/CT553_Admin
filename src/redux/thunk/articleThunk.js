import { createAsyncThunk } from "@reduxjs/toolkit";
import articleService from "@services/article.service";

export const getAllArticles = createAsyncThunk(
  "article/getAllArticles",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await articleService.getAll(accessToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createArticle = createAsyncThunk(
  "article/createArticle",
  async ({ accessToken, data }, { rejectWithValue }) => {
    try {
      const response = await articleService.create(accessToken, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateArticle = createAsyncThunk(
  "article/updateArticle",
  async ({ accessToken, articleId, data }, { rejectWithValue }) => {
    try {
      const response = await articleService.update(
        accessToken,
        articleId,
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteArticle = createAsyncThunk(
  "article/deleteArticle",
  async ({ accessToken, articleId }, { rejectWithValue }) => {
    try {
      const response = await articleService.delete(accessToken, articleId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
