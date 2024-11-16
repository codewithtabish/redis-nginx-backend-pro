import { Request, Response } from 'express';
import { db } from '../config/db';
import redisClient from '../config/redisClient';
import Tables from '../models';

// Signup method
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { clerkId, name, email, isStudent, isAdmin } = req.body;

    if (!clerkId || !name || !email) {
      res.status(400).json({ message: 'Clerk ID, name, and email are required' });
      return;
    }

    // Insert the new user into the database
    const newUser = await db.insert(Tables.Users).values({
      clerkId,
      name,
      email,
      isStudent: isStudent || false,
      isAdmin: isAdmin || false,
    }).returning();

    await redisClient.del('users');
    res.status(201).json({ message: 'User created', data: newUser });
  } catch (error: any) {
    res.status(500).json({ message: 'Signup failed', error: error.message });
  }
};

// Get all users method
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const cachedUsers = await redisClient.get('users');
    if (cachedUsers) {
      res.status(200).json({ message: 'Fetched from Redis', data: JSON.parse(cachedUsers) });
      return;
    }

    const users = await db.select().from(Tables.Users);
    await redisClient.set('users', JSON.stringify(users));
    res.status(200).json({ message: 'Fetched from DB', data: users });
  } catch (error: any) {
    res.status(500).json({ message: 'Fetching failed', error: error.message });
  }
};
