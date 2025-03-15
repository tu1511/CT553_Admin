import {
  createPolicy,
  deletePolicy,
  getAllPolicies,
  updatePolicy,
} from "@redux/thunk/policyThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  policies: [],
  policy: {},
  loading: false,
  error: null,
};

const setLoading = (state) => {
  state.loading = true;
};

const setFulfilled = (state) => {
  state.loading = false;
  state.error = null;
};

const setError = (state, action) => {
  state.loading = false;
  state.error = action.payload;
};

const policySlice = createSlice({
  name: "policies",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllPolicies.pending, setLoading)
      .addCase(getAllPolicies.fulfilled, (state, action) => {
        setFulfilled(state);
        state.policies = action.payload?.metadata;
      })
      .addCase(getAllPolicies.rejected, setError)
      .addCase(createPolicy.pending, setLoading)
      .addCase(createPolicy.fulfilled, (state, action) => {
        setFulfilled(state);
        state.policies.push(action.payload.metadata);
      })
      .addCase(createPolicy.rejected, setError)
      .addCase(updatePolicy.pending, setLoading)
      .addCase(updatePolicy.fulfilled, (state, action) => {
        setFulfilled(state);
        state.policy = action.payload.metadata;
      })
      .addCase(updatePolicy.rejected, setError)
      .addCase(deletePolicy.pending, setLoading)
      .addCase(deletePolicy.fulfilled, (state, action) => {
        setFulfilled(state);
        state.policies = state.policies.filter(
          (policy) => policy.id !== action.payload.metadata.id
        );
      })
      .addCase(deletePolicy.rejected, setError);
  },
});

export default policySlice.reducer;
