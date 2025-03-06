import {
  createArticle,
  deleteArticle,
  getAllArticles,
  updateArticle,
} from "@redux/thunk/articleThunk";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  articles: [],
  article: {},
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

const articleSlice = createSlice({
  name: "articles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllArticles.pending, setLoading)
      .addCase(getAllArticles.fulfilled, (state, action) => {
        setFulfilled(state);
        state.articles = action.payload?.metadata;
      })
      .addCase(getAllArticles.rejected, setError)
      .addCase(createArticle.pending, setLoading)
      .addCase(createArticle.fulfilled, (state, action) => {
        setFulfilled(state);
        state.articles.push(action.payload.metadata);
      })
      .addCase(createArticle.rejected, setError)
      .addCase(updateArticle.pending, setLoading)
      .addCase(updateArticle.fulfilled, (state, action) => {
        setFulfilled(state);
        state.article = action.payload.metadata;
      })
      .addCase(updateArticle.rejected, setError)
      .addCase(deleteArticle.pending, setLoading)
      .addCase(deleteArticle.fulfilled, (state, action) => {
        setFulfilled(state);
        state.articles = state.articles.filter(
          (article) => article.id !== action.payload.metadata.id
        );
      })
      .addCase(deleteArticle.rejected, setError);
  },
});

export default articleSlice.reducer;
