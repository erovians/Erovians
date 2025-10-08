import connectDB from "./config/DB.js";
import { app } from "./app.js";

import dotenv from "dotenv";
dotenv.config();

const PORT = process.env.PORT || 8000; 

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });
     app.listen(PORT , "0.0.0.0", () => {
      console.log(`Server is listening on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Databse connection failed !!", err);
  });
