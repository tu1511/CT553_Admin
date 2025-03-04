import {
  createCoupon,
  deleteCoupon,
  getAllCoupons,
  updateCoupon,
} from "@redux/thunk/couponThunk";
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
      .addCase(getAllCoupons.rejected, setError)
      .addCase(createCoupon.pending, setLoading)
      .addCase(createCoupon.fulfilled, (state, action) => {
        setFulfilled(state);
        state.coupon = action.payload?.metadata;
      })
      .addCase(createCoupon.rejected, setError)
      .addCase(updateCoupon.pending, setLoading)
      .addCase(updateCoupon.fulfilled, (state, action) => {
        setFulfilled(state);
        state.coupon = action.payload?.metadata;
      })
      .addCase(updateCoupon.rejected, setError)
      .addCase(deleteCoupon.pending, setLoading)
      .addCase(deleteCoupon.fulfilled, setFulfilled)
      .addCase(deleteCoupon.rejected, setError);
  },
});

export default couponSlice.reducer;
