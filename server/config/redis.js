import { createClient } from "redis";
import logger from "./winston.js"; // ✅ .js extension add karo agar ES modules use kar rahe ho

const client = createClient({
  url: process.env.REDIS_URL,
});

client.connect();

client.on("connect", () => {
  logger.info("Redis connected"); // ✅ Winston use karo
});

client.on("error", (err) => {
  logger.error(`Redis error: ${err.message}`); // ✅ Winston use karo
});

export default client;
