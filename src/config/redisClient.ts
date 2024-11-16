import Redis from 'ioredis';

// Your Redis URL from Railway
const redisUrl = 'redis://default:aoJLSayOVsjaUICVlZAKBsLobjVOUjmZ@junction.proxy.rlwy.net:44863';

// Initialize Redis client (auto-connects by default)
const redisClient = new Redis(redisUrl);

// Event listeners for connection status
redisClient.on('connect', () => {
  console.log('✅ Connected to Redis');
});

redisClient.on('error', (error) => {
  console.error('❌ Redis connection error:', error);
});

export default redisClient;
