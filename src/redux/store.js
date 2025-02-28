import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

import authSlice from "@redux/slices/authSlice";
import productSlice from "@redux/slices/productSlide";
import categorySlice from "@redux/slices/categorySlice";
import orderSlice from "@redux/slices/orderSlice";
import accountSlice from "@redux/slices/accountSlice";
// import addressSlice from "@redux/slices/addressSlice";
// import cartSlice from "@redux/slices/cartSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["users", "auth"],
};

const rootReducer = combineReducers({
  auth: authSlice,
  product: productSlice,
  category: categorySlice,
  account: accountSlice,
  orders: orderSlice,
  // address: addressSlice,
  // cart: cartSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
