import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function generateRecommendations(user: any) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Based on the following user profile, suggest 3 meals:
    Mood: ${user.mood_history.current}
    Health Profile: ${JSON.stringify(user.health_profile)}
    Preferences: ${JSON.stringify(user.preferences)}
    
    Format the response as JSON with this structure:
    {
      "recommendations": [
        {
          "title": "Meal Name",
          "description": "Brief description",
          "image": "URL to a relevant Unsplash image",
          "nutritionInfo": "Calories and macros"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const recommendations = JSON.parse(response.text());
    
    return recommendations;
  } catch (error) {
    console.error('Error generating recommendations:', error);
    // Return fallback recommendations if AI fails
    return {
      recommendations: [
        {
          title: "Mediterranean Bowl",
          description: "Fresh and energizing bowl with quinoa, hummus, and roasted vegetables",
          image: "https://images.unsplash.com/photo-1514852451047-f8e1d1cd9b64",
          nutritionInfo: "520 cal | 18g protein | 12g fat"
        },
        {
          title: "Energizing Smoothie Bowl",
          description: "Antioxidant-rich smoothie bowl with fresh berries and granola",
          image: "https://images.unsplash.com/photo-1479803244419-b24dfe9cbafa",
          nutritionInfo: "380 cal | 14g protein | 8g fat"
        },
        {
          title: "Grilled Salmon Plate",
          description: "Omega-3 rich salmon with roasted sweet potato and greens",
          image: "https://images.unsplash.com/31/RpgvvtYAQeqAIs1knERU_vegetables.jpg",
          nutritionInfo: "450 cal | 32g protein | 15g fat"
        }
      ]
    };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const result = await sql`
      SELECT * FROM users 
      ORDER BY id DESC 
      LIMIT 1;
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No user found' });
    }

    const recommendations = await generateRecommendations(result.rows[0]);
    res.status(200).json(recommendations.recommendations);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ message: 'Failed to generate recommendations' });
  }
}
