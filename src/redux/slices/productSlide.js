import { createProduct, getProducts } from "@redux/thunk/productThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  product: {},
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

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, setLoading)
      .addCase(getProducts.fulfilled, (state, action) => {
        setFulfilled(state);
        state.products = action.payload?.metadata;
      })
      .addCase(getProducts.rejected, setError)

      //   .addCase(getProductById.pending, setLoading)
      //   .addCase(getProductById.fulfilled, (state, action) => {
      //     setFulfilled(state);
      //     state.product = action.payload;
      //   })
      //   .addCase(getProductById.rejected, setError)

      .addCase(createProduct.pending, setLoading)
      .addCase(createProduct.fulfilled, (state, action) => {
        setFulfilled(state);
        state.products = Array.isArray(action.payload?.metadata)
          ? action.payload.metadata
          : [];
      })
      .addCase(createProduct.rejected, setError);

    //   .addCase(updateProduct.pending, setLoading)
    //   .addCase(updateProduct.fulfilled, (state, action) => {
    //     setFulfilled(state);
    //     state.products = state.products.map((product) =>
    //       product._id === action.payload._id ? action.payload : product
    //     );
    //   })
    //   .addCase(updateProduct.rejected, setError)

    //   .addCase(deleteProduct.pending, setLoading)
    //   .addCase(deleteProduct.fulfilled, (state, action) => {
    //     setFulfilled(state);
    //     state.products = state.products.filter(
    //       (product) => product._id !== action.payload
    //     );
    //   })
    //   .addCase(deleteProduct.rejected, setError);
  },
});

export default productSlice.reducer;
