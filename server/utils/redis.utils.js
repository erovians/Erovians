import { createClient } from "redis";
import logger from "../config/winston.js";

const client = createClient({
  url: process.env.REDIS_URL,
});

client.connect();

client.on("connect", () => {
  logger.info("✅ Redis connected");
});

client.on("error", (err) => {
  logger.error(`❌ Redis error: ${err.message}`);
});

export default client;
