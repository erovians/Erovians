import { configureStore } from "@reduxjs/toolkit";
import sellerReducer from "./slice/sellerSlice";
import sidebarReducer from "./slice/sellerSidebarSlice";

export const store = configureStore({
  reducer: {
    seller: sellerReducer,
    sidebar: sidebarReducer,
  },
});

export default store;
