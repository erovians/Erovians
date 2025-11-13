import { configureStore } from "@reduxjs/toolkit";
import sellerReducer from "./slice/sellerSlice";
import sidebarReducer from "./slice/sellerSidebarSlice";
import productReducer from "./slice/productSlice";
import companyReducer from "./slice/companySlice";
import certificatesReducer from "./slice/certificatesSlice";
import inquiryReducer from "./slice/inquirySlice";

export const store = configureStore({
  reducer: {
    seller: sellerReducer,
    sidebar: sidebarReducer,
    products: productReducer,
    company: companyReducer,
    certificates: certificatesReducer,
    inquiries: inquiryReducer,
  },
});

export default store;
