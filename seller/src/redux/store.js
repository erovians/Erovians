import { configureStore } from "@reduxjs/toolkit";
import sellerReducer from "./slice/sellerSlice";
import sidebarReducer from "./slice/sellerSidebarSlice";
import productReducer from "./slice/productSlice";
import companyReducer from "./slice/companySlice";
import certificatesReducer from "./slice/certificatesSlice";
import inquiryReducer from "./slice/inquirySlice";
import countryReducer from "./slice/countrySlice";
import categoryReducer from "./slice/categorySlice";
export const store = configureStore({
  reducer: {
    seller: sellerReducer,
    sidebar: sidebarReducer,
    products: productReducer,
    company: companyReducer,
    certificates: certificatesReducer,
    inquiries: inquiryReducer,
    country: countryReducer,
    category: categoryReducer,
  },
});

export default store;
