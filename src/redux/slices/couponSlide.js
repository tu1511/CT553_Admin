import { getAllCoupons } from "@redux/thunk/couponThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  coupons: [],
  coupon: {},
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

const couponSlice = createSlice({
  name: "coupon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCoupons.pending, setLoading)
      .addCase(getAllCoupons.fulfilled, (state, action) => {
        setFulfilled(state);
        state.coupons = action.payload?.metadata;
      })
      .addCase(getAllCoupons.rejected, setError);
  },
});

export default couponSlice.reducer;
