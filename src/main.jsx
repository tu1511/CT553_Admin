import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";

import { PersistGate } from "redux-persist/integration/react";
import LoadingPage from "@pages/LoadingPage.jsx";
import store, { persistor } from "@redux/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<LoadingPage />} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
