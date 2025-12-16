import client from "../utils/redis.utils.js";

export const cache = {
  // GET KEY
  async get(key) {
    try {
      const value = await client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (err) {
      console.error("Redis GET Error:", err);
      return null;
    }
  },

  async set(key, data, ttl = 600) {
    try {
      await client.setEx(key, ttl, JSON.stringify(data));
    } catch (err) {
      console.error("Redis SET Error:", err);
    }
  },

  // DELETE A KEY
  async del(key) {
    try {
      await client.del(key);
    } catch (err) {
      console.error("Redis DEL Error:", err);
    }
  },

  // DELETE MULTIPLE KEYS USING PATTERN
  async clearPattern(pattern) {
    try {
      const keys = await client.keys(pattern);
      if (keys.length > 0) {
        await client.del(keys);
      }
    } catch (err) {
      console.error("Redis Clear Pattern Error:", err);
    }
  },

  async incr(key) {
    return await client.incr(key);
  },
};
