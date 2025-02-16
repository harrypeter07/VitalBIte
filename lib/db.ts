import { sql } from '@vercel/postgres';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export async function query(query: string, values: any[] = []) {
  try {
    const result = await sql.query(query, values);
    return result;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch data from database');
  }
}

export const healthProfileSchema = z.object({
  dietaryRestrictions: z.array(z.string()),
  allergies: z.array(z.string()),
  healthGoals: z.array(z.string()),
  activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active']),
});

export const moodSchema = z.object({
  current: z.enum(['happy', 'sad', 'stressed', 'energetic', 'tired']),
  energy: z.number().min(1).max(10),
  hunger: z.number().min(1).max(10),
});

export const preferencesSchema = z.object({
  cuisineTypes: z.array(z.string()),
  spiceLevel: z.number().min(1).max(5),
  mealSize: z.enum(['small', 'medium', 'large']),
});

export const insertUserSchema = z.object({
  preferences: preferencesSchema,
  healthProfile: healthProfileSchema,
  moodHistory: z.object({
    current: moodSchema,
  }),
});

export type HealthProfile = z.infer<typeof healthProfileSchema>;
export type MoodData = z.infer<typeof moodSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
