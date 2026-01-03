import { createClient } from "redis";
import logger from "../config/winston.js";

const client = createClient({
  url: `redis://${process.env.REDIS_HOST || "redis"}:${
    process.env.REDIS_PORT || 6379
  }`,
});

client.connect();

client.on("connect", () => {
  logger.info("Redis connected"); // ✅ Winston use karo
});

client.on("error", (err) => {
  logger.error(`Redis error: ${err.message}`); // ✅ Winston use karo
});

export default client;
