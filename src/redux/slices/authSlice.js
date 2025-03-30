import { createSlice } from "@reduxjs/toolkit";
import {
  getLoggedInUserThunk,
  loginThunk,
  registerThunk,
} from "@redux/thunk/authThunk";

const initialState = {
  authUser: null,
  error: "",
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.authUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = action.payload?.metadata?.account;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getLoggedInUserThunk.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getLoggedInUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.authUser = action.payload?.metadata;
      })
      .addCase(getLoggedInUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCredentials } = authSlice.actions;

export default authSlice.reducer;
