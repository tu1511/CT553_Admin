import { getAllOrder, updateOrderStatus } from "@redux/thunk/orderThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  order: {},
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

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllOrder.pending, setLoading)
      .addCase(getAllOrder.fulfilled, (state, action) => {
        setFulfilled(state);
        state.orders = action.payload?.metadata;
      })
      .addCase(getAllOrder.rejected, setError)

      .addCase(updateOrderStatus.pending, setLoading)
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        setFulfilled(state);
        state.orders = action.payload?.metadata;
      })
      .addCase(updateOrderStatus.rejected, setError);
  },
});

export default orderSlice.reducer;
