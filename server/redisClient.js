const { createClient } = require('redis');

// This configuration is crucial for deployment.
// It tells the Redis client to use the URL from your Render environment variables.
// If process.env.REDIS_URL is not found, it will try to connect to localhost.
const clientConfig = {
  url: process.env.REDIS_URL
};

const redisClient = createClient(clientConfig);

redisClient.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redisClient.connect();
})();

// We log the connection success message in the connect() promise now
redisClient.on('connect', () => {
    console.log('Redis connected successfully.');
});

module.exports = redisClient;