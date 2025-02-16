import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  preferences: jsonb("preferences").notNull(),
  healthProfile: jsonb("health_profile").notNull(),
  moodHistory: jsonb("mood_history").notNull(),
});

export const recommendations = pgTable("recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  recommendation: jsonb("recommendation").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  preferences: true,
  healthProfile: true,
  moodHistory: true,
});

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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Recommendation = typeof recommendations.$inferSelect;
export type HealthProfile = z.infer<typeof healthProfileSchema>;
export type MoodData = z.infer<typeof moodSchema>;
export type Preferences = z.infer<typeof preferencesSchema>;
