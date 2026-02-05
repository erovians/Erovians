import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import { combineReducers } from "redux";

// Import your reducers
import authReducer from "../lib/redux/auth/authSlice";
import compnayReducer from "../lib/redux/company/companySlice";
import categoryReducer from "../lib/redux/category/categorySlice";
import quotationReducer from "../lib/redux/quotation/quotationSlice";
const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["user", "isAuthenticated"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

// Combine reducers
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  company: compnayReducer,
  category: categoryReducer,
  quotation: quotationReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
          "persist/FLUSH",
        ],
      },
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export const persistor = persistStore(store);

export default store;
