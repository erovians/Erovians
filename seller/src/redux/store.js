import { configureStore } from "@reduxjs/toolkit";
import sellerReducer from "./slice/sellerSlice";

export const store = configureStore({
  reducer: {
    seller: sellerReducer,
  },
});

export default store;
