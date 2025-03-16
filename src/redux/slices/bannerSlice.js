import {
  createBanner,
  getAdminBanners,
  updateBanner,
} from "@redux/thunk/bannerThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  banners: [],
  banner: {},
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

const bannerSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminBanners.pending, setLoading)
      .addCase(getAdminBanners.fulfilled, (state, action) => {
        setFulfilled(state);
        state.banners = action.payload?.metadata;
      })
      .addCase(getAdminBanners.rejected, setError)
      .addCase(createBanner.pending, setLoading)
      .addCase(createBanner.fulfilled, (state, action) => {
        setFulfilled(state);
        state.banner = action.payload?.metadata;
      })
      .addCase(createBanner.rejected, setError)
      .addCase(updateBanner.pending, setLoading)
      .addCase(updateBanner.fulfilled, (state, action) => {
        setFulfilled(state);
        state.banner = action.payload?.metadata;
      })
      .addCase(updateBanner.rejected, setError);
  },
});

export default bannerSlice.reducer;
