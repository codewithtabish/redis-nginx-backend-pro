// app.ts
import dotenv from 'dotenv';
dotenv.config();

import express, { Application, Request, Response } from 'express';
import { isDbConnected, testConnection } from './config/database';
import redisClient from './config/redisClient';
import userRouter from './routes/user-router';

const app: Application = express();
const PORT = process.env.PORT || 3000;
// Middleware for JSON parsing

app.use(express.json());
app.use('/api/v1/user', userRouter);

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});
app.get('/test', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express from test!');
});


// Route: Set value in Redis
app.get('/set-redis', async (req: Request, res: Response) => {
  try {
    const result = await redisClient.set('mobile', 'iPhone');
    res.status(200).send(`Redis SET operation successful: ${result}`);
  } catch (error) {
    console.error('❌ Error setting value in Redis:', error);
    res.status(500).send('Error setting value in Redis');
  }
});

// Route: Get value from Redis
app.get('/get-redis', async (req: Request, res: Response) => {
  try {
    const value = await redisClient.get('mobile');
    if (value) {
      res.status(200).send(`Value from Redis: ${value}`);
    } else {
      res.status(404).send('Key not found in Redis');
    }
  } catch (error) {
    console.error('❌ Error getting value from Redis:', error);
    res.status(500).send('Error getting value from Redis');
  }
});




// Error handling for uncaught exceptions and unhandled promise rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1); // Exits the process with failure code
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1); // Exits the process with failure code
});

// Start the server
// Start the server
app
  .listen(PORT, async () => {
    try {
      // Test database connection first
      if (!isDbConnected()) {
        await testConnection(); 
      } else {
        console.log('⚠️ Database is already connected.');
      }

      // Check Redis connection status before connecting
      if (redisClient.status !== 'ready' && redisClient.status !== 'connecting') {
        await redisClient.connect(); // Only connect if not already connected
        console.log('✅ Redis connected successfully.');
      } else {
        console.log('⚠️ Redis is already connecting or connected.');
      }

      // Start the server once both DB and Redis are connected
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    } catch (error) {
      console.error('❌ Error during initialization:', error);
      process.exit(1);
    }
  })
  .on('error', (err) => {
    console.error('❌ Error starting server:', err.message);
  });


//   3c285c87cdf14f6fa79bf4677771d73a
