import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, type User } from "@shared/schema";

async function generateRecommendations(user: User) {
  // This would be replaced with actual Gemini API integration
  const sampleImages = [
    "https://images.unsplash.com/photo-1514852451047-f8e1d1cd9b64",
    "https://images.unsplash.com/photo-1479803244419-b24dfe9cbafa",
    "https://images.unsplash.com/31/RpgvvtYAQeqAIs1knERU_vegetables.jpg",
  ];

  const recommendations = [
    {
      title: "Mediterranean Bowl",
      description: "Fresh and energizing bowl with quinoa, hummus, and roasted vegetables",
      image: sampleImages[0],
      nutritionInfo: "520 cal | 18g protein | 12g fat",
    },
    {
      title: "Energizing Smoothie Bowl",
      description: "Antioxidant-rich smoothie bowl with fresh berries and granola",
      image: sampleImages[1],
      nutritionInfo: "380 cal | 14g protein | 8g fat",
    },
    {
      title: "Grilled Salmon Plate",
      description: "Omega-3 rich salmon with roasted sweet potato and greens",
      image: sampleImages[2],
      nutritionInfo: "450 cal | 32g protein | 15g fat",
    },
  ];

  return recommendations;
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.get("/api/recommendations", async (req, res) => {
    try {
      const user = await storage.getLatestUser();
      if (!user) {
        return res.status(404).json({ message: "No user found" });
      }

      const recommendations = await generateRecommendations(user);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
