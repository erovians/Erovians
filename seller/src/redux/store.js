import { configureStore } from "@reduxjs/toolkit";
import sellerReducer from "./slice/sellerSlice";
import sidebarReducer from "./slice/sellerSidebarSlice";
import productReducer from "./slice/productSlice";

export const store = configureStore({
  reducer: {
    seller: sellerReducer,
    sidebar: sidebarReducer,
    products: productReducer,
  },
});

export default store;
