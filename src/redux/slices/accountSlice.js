import { createSlice } from "@reduxjs/toolkit";
import {
  getLoggedInUser,
  getAllAccount,
  updateAccountThunk,
} from "@redux/thunk/accountThunk";

const accountSlice = createSlice({
  name: "account",
  initialState: {
    account: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllAccount.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getAllAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.account = action.payload.metadata;
      })
      .addCase(getAllAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getLoggedInUser.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getLoggedInUser.fulfilled, (state, action) => {
        state.loading = false;
        state.account = action.payload.metadata;
      })
      .addCase(getLoggedInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAccountThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updateAccountThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateAccountThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.metadata;
      });
  },
});

export default accountSlice.reducer;
