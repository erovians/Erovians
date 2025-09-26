import connectDB from "./config/DB.js";
import { app } from "./app.js";

import dotenv from "dotenv";
dotenv.config();

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is listning on PORT : ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("Databse connection failed !!", err);
  });
