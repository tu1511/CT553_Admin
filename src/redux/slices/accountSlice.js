import { createSlice } from "@reduxjs/toolkit";
import {
  updateUserInfoThunk,
  getLoggedInUser,
  changePasswordThunk,
  getAllAccount,
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
      .addCase(changePasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
    builder.addCase(updateUserInfoThunk.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(updateUserInfoThunk.fulfilled, (state, action) => {
      state.loading = false;
      state.account = action.payload.metadata;
    });

    builder.addCase(updateUserInfoThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export default accountSlice.reducer;
