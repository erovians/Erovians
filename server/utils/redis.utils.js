import { createClient } from "redis";

const client = createClient({
  url: "redis://127.0.0.1:6379",
});

client.connect();

client.on("connect", () => {
  console.log("🔥 Redis connected");
});

client.on("error", (err) => {
  console.error("Redis error:", err);
});

export default client;
