import { getAllReviews } from "@redux/thunk/reviewThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  reviews: [],
  review: {},
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

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllReviews.pending, setLoading)
      .addCase(getAllReviews.fulfilled, (state, action) => {
        setFulfilled(state);
        state.reviews = action.payload?.metadata;
      })
      .addCase(getAllReviews.rejected, setError);
  },
});

export default reviewSlice.reducer;
