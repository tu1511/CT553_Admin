import { createAsyncThunk } from "@reduxjs/toolkit";
import policyService from "@services/policy.service";

export const getAllPolicies = createAsyncThunk(
  "policy/getAllPolicies",
  async (accessToken, { rejectWithValue }) => {
    try {
      const response = await policyService.getAll(accessToken);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createPolicy = createAsyncThunk(
  "policy/createPolicy",
  async ({ accessToken, data }, { rejectWithValue }) => {
    try {
      const response = await policyService.create(accessToken, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updatePolicy = createAsyncThunk(
  "policy/updatePolicy",
  async ({ accessToken, policyId, data }, { rejectWithValue }) => {
    try {
      const response = await policyService.update(accessToken, policyId, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deletePolicy = createAsyncThunk(
  "policy/deletePolicy",
  async ({ accessToken, policyId }, { rejectWithValue }) => {
    try {
      const response = await policyService.delete(accessToken, policyId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
