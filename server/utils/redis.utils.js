import { createClient } from "redis";
import logger from "../config/winston.js";

const client = createClient({
  url: `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${
    process.env.REDIS_PORT || 6379
  }`,
});

client.connect();

client.on("connect", () => {
  logger.info("✅ Redis connected");
});

client.on("error", (err) => {
  logger.error(`❌ Redis error: ${err.message}`);
});

export default client;
