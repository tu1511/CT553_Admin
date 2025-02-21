import {
  createCategory,
  getCategories,
  updateCategory,
} from "@redux/thunk/categoryThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  categories: [],
  category: {},
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

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, setLoading)
      .addCase(getCategories.fulfilled, (state, action) => {
        setFulfilled(state);
        state.categories = action.payload?.metadata;
      })
      .addCase(getCategories.rejected, setError)

      .addCase(createCategory.pending, setLoading)
      .addCase(createCategory.fulfilled, (state, action) => {
        setFulfilled(state);
        state.categories.push(action.payload?.metadata);
      })
      .addCase(createCategory.rejected, setError)
      .addCase(updateCategory.pending, setLoading)
      .addCase(updateCategory.fulfilled, (state, action) => {
        setFulfilled(state);
        state.categories = state.categories.map((category) =>
          category._id === action.payload?.metadata._id
            ? action.payload?.metadata
            : category
        );
      })
      .addCase(updateCategory.rejected, setError);

    //   .addCase(deleteCategory.pending, setLoading)
    //   .addCase(deleteCategory.fulfilled, (state, action) => {
    //     setFulfilled(state);
    //     state.categories = state.categories.filter(
    //       (category) => category._id !== action.payload
    //     );
    //   })
    //   .addCase(deleteCategory.rejected, setError);
  },
});

export default categorySlice.reducer;
