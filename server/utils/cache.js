import { createClient } from 'redis';

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

export const getCache = async (key) => {
  const value = await client.get(key);
  return value ? JSON.parse(value) : null;
};

export const setCache = async (key, value, expireIn = 3600) => {
  await client.set(key, JSON.stringify(value), {
    EX: expireIn
  });
};

export const clearCache = async (key) => {
  await client.del(key);
};