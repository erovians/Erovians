// import connectDB from "./config/DB.js";
// import { app, server } from "./app.js";
// import dotenv from "dotenv";

// dotenv.config();

// const PORT = process.env.PORT || 8000;

// connectDB()
//   .then(() => {
//     app.on("error", (error) => {
//       console.log("Error", error);
//       throw error;
//     });
//     app.listen(PORT, "0.0.0.0", () => {
//       console.log(`Server is listening on PORT: ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.log("Databse connection failed !!", err);
//   });

import connectDB from "./config/DB.js";
import { app, server } from "./app.js"; // ✅ Import server instead of app.listen
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    server.on("error", (error) => {
      console.log("Error", error);
      throw error;
    });

    server.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server + Socket is running on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("❌ Database connection failed !!", err);
  });
