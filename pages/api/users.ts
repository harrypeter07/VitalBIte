import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { insertUserSchema } from '@shared/schema';
import { type InsertUser } from '@shared/schema';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const userData = insertUserSchema.parse(req.body);

    const result = await sql`
      INSERT INTO users (preferences, health_profile, mood_history)
      VALUES (${JSON.stringify(userData.preferences)}, ${JSON.stringify(userData.healthProfile)}, ${JSON.stringify(userData.moodHistory)})
      RETURNING *;
    `;

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(400).json({ message: 'Invalid user data' });
  }
}