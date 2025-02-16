import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with error handling
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

async function generateRecommendations(user: any) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Based on the following user profile, suggest 3 meals that would be perfect for their current mood and preferences. Be creative and specific:

    Current Mood: ${user.mood_history.current.current}
    Energy Level: ${user.mood_history.current.energy}/10
    Health Profile:
    - Activity Level: ${user.health_profile.activityLevel}
    - Dietary Restrictions: ${user.health_profile.dietaryRestrictions.join(', ') || 'None'}
    - Health Goals: ${user.health_profile.healthGoals.join(', ') || 'Not specified'}

    Food Preferences:
    - Spice Level: ${user.preferences.spiceLevel}/5
    - Preferred Portion Size: ${user.preferences.mealSize}

    For each meal, provide:
    1. An appealing name
    2. A brief description highlighting why it matches their profile
    3. Basic nutrition information

    Format as JSON with this structure:
    {
      "recommendations": [
        {
          "title": "Meal Name",
          "description": "2-3 sentence description",
          "image": "URL to a relevant Unsplash image about this type of food",
          "nutritionInfo": "Calories and macros"
        }
      ]
    }`;

    console.log('Sending prompt to Gemini AI:', prompt);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('Received response from Gemini AI:', text);

    try {
      const recommendations = JSON.parse(text);
      return recommendations;
    } catch (parseError) {
      console.error('Failed to parse Gemini AI response:', text);
      throw new Error('Invalid response format from AI');
    }
  } catch (error) {
    console.error('Error in Gemini AI generation:', error);
    // Return fallback recommendations if AI fails
    return {
      recommendations: [
        {
          title: "Mediterranean Bowl",
          description: "Fresh and energizing bowl with quinoa, hummus, and roasted vegetables. Perfect for your current energy level and health goals.",
          image: "https://images.unsplash.com/photo-1514852451047-f8e1d1cd9b64",
          nutritionInfo: "520 cal | 18g protein | 12g fat"
        },
        {
          title: "Energizing Smoothie Bowl",
          description: "Antioxidant-rich smoothie bowl with fresh berries and granola. A light but satisfying option aligned with your preferences.",
          image: "https://images.unsplash.com/photo-1479803244419-b24dfe9cbafa",
          nutritionInfo: "380 cal | 14g protein | 8g fat"
        },
        {
          title: "Grilled Salmon Plate",
          description: "Omega-3 rich salmon with roasted sweet potato and greens. Portioned according to your preferences with adjustable seasoning.",
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
    console.log('Final recommendations:', recommendations);
    res.status(200).json(recommendations.recommendations);
  } catch (error) {
    console.error('Error in recommendations handler:', error);
    res.status(500).json({ 
      message: 'Failed to generate recommendations',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}