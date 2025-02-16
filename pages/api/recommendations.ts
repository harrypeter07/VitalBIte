import type { NextApiRequest, NextApiResponse } from 'next';
import { sql } from '@vercel/postgres';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI with error handling
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Fallback recommendations with 28 diverse meal options
const fallbackRecommendations = {
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
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
      nutritionInfo: "450 cal | 32g protein | 15g fat"
    },
    {
      title: "Thai Green Curry",
      description: "Aromatic coconut curry with tofu and seasonal vegetables. Customizable spice level to match your preferences.",
      image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd",
      nutritionInfo: "420 cal | 15g protein | 18g fat"
    },
    {
      title: "Power Protein Breakfast",
      description: "Scrambled eggs with spinach, mushrooms, and whole grain toast. High in protein for sustained energy.",
      image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543",
      nutritionInfo: "480 cal | 28g protein | 14g fat"
    },
    {
      title: "Zen Buddha Bowl",
      description: "Brown rice, roasted chickpeas, avocado, and mixed vegetables. Perfect for mindful eating and balanced nutrition.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      nutritionInfo: "550 cal | 20g protein | 22g fat"
    },
    {
      title: "Mexican Street Bowl",
      description: "Black beans, corn, quinoa, with fresh salsa and lime. Vibrant flavors with adjustable spice levels.",
      image: "https://images.unsplash.com/photo-1501474653110-7c7c8e6c2fec",
      nutritionInfo: "490 cal | 16g protein | 10g fat"
    },
    {
      title: "Japanese Bento Box",
      description: "Teriyaki chicken, brown rice, steamed vegetables, and miso soup. A balanced meal with variety.",
      image: "https://images.unsplash.com/photo-1516684732162-798a0062be99",
      nutritionInfo: "580 cal | 35g protein | 12g fat"
    },
    {
      title: "Rainbow Poke Bowl",
      description: "Fresh tuna, mango, edamame, and rice with ponzu sauce. Rich in omega-3s and perfect for hot days.",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      nutritionInfo: "450 cal | 28g protein | 11g fat"
    },
    {
      title: "Moroccan Tagine",
      description: "Slow-cooked vegetables with aromatic spices and couscous. Warming and comforting with complex flavors.",
      image: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38",
      nutritionInfo: "420 cal | 12g protein | 8g fat"
    },
    {
      title: "Italian Garden Pizza",
      description: "Whole wheat crust with roasted vegetables and fresh mozzarella. A lighter take on traditional pizza.",
      image: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5",
      nutritionInfo: "680 cal | 24g protein | 22g fat"
    },
    {
      title: "Superfood Salad",
      description: "Kale, quinoa, blueberries, and seeds with lemon dressing. Packed with antioxidants and nutrients.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      nutritionInfo: "380 cal | 12g protein | 18g fat"
    },
    {
      title: "Asian Fusion Noodles",
      description: "Rice noodles with mixed vegetables in ginger-soy sauce. Light yet satisfying with umami flavors.",
      image: "https://images.unsplash.com/photo-1557872943-16a5ac26437e",
      nutritionInfo: "420 cal | 14g protein | 8g fat"
    },
    {
      title: "Mediterranean Wrap",
      description: "Grilled vegetables, hummus, and feta in whole grain wrap. Perfect for an energizing lunch.",
      image: "https://images.unsplash.com/photo-1509722747041-616f39b57569",
      nutritionInfo: "440 cal | 16g protein | 18g fat"
    },
    {
      title: "Indian Dal Bowl",
      description: "Spiced lentils with basmati rice and roasted cauliflower. Rich in plant-based protein and fiber.",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe",
      nutritionInfo: "460 cal | 18g protein | 6g fat"
    },
    {
      title: "Green Goddess Bowl",
      description: "Mixed greens, avocado, cucumber, and herbs with tahini dressing. Light and refreshing.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      nutritionInfo: "340 cal | 8g protein | 22g fat"
    },
    {
      title: "Korean Bibimbap",
      description: "Rice bowl with vegetables, egg, and gochujang sauce. Customizable spice level and protein options.",
      image: "https://images.unsplash.com/photo-1553163147-622ab57be1c7",
      nutritionInfo: "520 cal | 22g protein | 14g fat"
    },
    {
      title: "Comfort Mac & Greens",
      description: "Whole grain pasta with cashew cheese sauce and sautéed greens. A healthier take on comfort food.",
      image: "https://images.unsplash.com/photo-1543339494-b4cd4f7ba686",
      nutritionInfo: "560 cal | 18g protein | 16g fat"
    },
    {
      title: "Vietnamese Pho",
      description: "Rice noodles in aromatic broth with herbs and vegetables. Warming and satisfying.",
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43",
      nutritionInfo: "380 cal | 24g protein | 6g fat"
    },
    {
      title: "Greek Power Plate",
      description: "Grilled chicken, quinoa tabbouleh, and tzatziki. High protein with Mediterranean flavors.",
      image: "https://images.unsplash.com/photo-1529059997568-3d847b1154f0",
      nutritionInfo: "520 cal | 38g protein | 14g fat"
    },
    {
      title: "Forest Mushroom Risotto",
      description: "Creamy arborio rice with mixed mushrooms and herbs. Comforting and rich in umami.",
      image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371",
      nutritionInfo: "480 cal | 12g protein | 14g fat"
    },
    {
      title: "Southwest Quinoa Bowl",
      description: "Spiced quinoa with black beans, corn, and avocado. Plant-based protein with Mexican flavors.",
      image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2",
      nutritionInfo: "460 cal | 16g protein | 18g fat"
    },
    {
      title: "Mediterranean Fish Stew",
      description: "White fish and vegetables in tomato-saffron broth. Light yet satisfying with complex flavors.",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
      nutritionInfo: "420 cal | 32g protein | 10g fat"
    },
    {
      title: "Tempeh Taco Bowl",
      description: "Marinated tempeh with Mexican-spiced rice and vegetables. High protein plant-based option.",
      image: "https://images.unsplash.com/photo-1504544750208-dc0358e63f7f",
      nutritionInfo: "490 cal | 24g protein | 16g fat"
    },
    {
      title: "Garden Harvest Plate",
      description: "Seasonal roasted vegetables with quinoa and herb dressing. Fresh and adaptable to preferences.",
      image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f",
      nutritionInfo: "380 cal | 10g protein | 14g fat"
    },
    {
      title: "Asian Lettuce Wraps",
      description: "Minced chicken or tofu with water chestnuts in lettuce cups. Light and refreshing with protein.",
      image: "https://images.unsplash.com/photo-1515669097368-22e68427d265",
      nutritionInfo: "320 cal | 26g protein | 8g fat"
    },
    {
      title: "Persian Jeweled Rice",
      description: "Saffron rice with dried fruits, nuts, and herbs. A colorful and aromatic vegetarian option.",
      image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6",
      nutritionInfo: "440 cal | 8g protein | 12g fat"
    },
    {
      title: "Nordic Salmon Bowl",
      description: "Graved salmon with dill, potatoes, and pickled vegetables. Rich in omega-3s and protein.",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288",
      nutritionInfo: "480 cal | 34g protein | 16g fat"
    },
    {
      title: "Sichuan Mapo Tofu",
      description: "Silky tofu in spicy Sichuan pepper sauce with minced pork. Adjustable spice level for heat preferences.",
      image: "https://images.unsplash.com/photo-1582252852935-c5843e0d6c8c",
      nutritionInfo: "420 cal | 22g protein | 16g fat"
    },
    {
      title: "Brazilian Açaí Bowl",
      description: "Frozen açaí blend topped with granola, banana, and honey. Perfect for energy and antioxidants.",
      image: "https://images.unsplash.com/photo-1590301157890-4810ed352733",
      nutritionInfo: "340 cal | 8g protein | 14g fat"
    },
    {
      title: "Spanish Seafood Paella",
      description: "Saffron rice with mixed seafood, vegetables, and lemon. Rich in protein and Mediterranean flavors.",
      image: "https://images.unsplash.com/photo-1534080564583-6be75777b70a",
      nutritionInfo: "560 cal | 32g protein | 18g fat"
    },
    {
      title: "Turkish Lentil Soup",
      description: "Warming red lentil soup with mint and lemon. High in protein and perfect for cooler days.",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd",
      nutritionInfo: "280 cal | 16g protein | 4g fat"
    },
    {
      title: "Hawaiian Poke Stack",
      description: "Fresh ahi tuna, mango, and avocado stack with sushi rice. Light and protein-rich with tropical flavors.",
      image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351",
      nutritionInfo: "420 cal | 28g protein | 12g fat"
    },
    {
      title: "Ethiopian Veggie Platter",
      description: "Colorful selection of spiced lentils, vegetables, and injera bread. Rich in plant-based protein.",
      image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2",
      nutritionInfo: "480 cal | 18g protein | 10g fat"
    },
    {
      title: "Middle Eastern Shakshuka",
      description: "Eggs poached in spiced tomato sauce with fresh herbs. Perfect for any time of day.",
      image: "https://images.unsplash.com/photo-1590412200988-a436970781fa",
      nutritionInfo: "340 cal | 22g protein | 16g fat"
    },
    {
      title: "Caribbean Jerk Bowl",
      description: "Spiced jerk chicken with coconut rice and plantains. Bold flavors with balanced nutrition.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
      nutritionInfo: "580 cal | 35g protein | 20g fat"
    },
    {
      title: "Russian Borscht",
      description: "Hearty beet soup with vegetables and fresh dill. Warming and nutrient-rich comfort food.",
      image: "https://images.unsplash.com/photo-1547308283-f87a3d6377b4",
      nutritionInfo: "320 cal | 12g protein | 8g fat"
    },
    {
      title: "Indonesian Gado-Gado",
      description: "Mixed vegetables and tofu with peanut sauce. Plant-based protein with complex flavors.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19",
      nutritionInfo: "440 cal | 18g protein | 22g fat"
    },
    {
      title: "French Ratatouille",
      description: "Provençal stewed vegetables with herbs and olive oil. Light and packed with Mediterranean vegetables.",
      image: "https://images.unsplash.com/photo-1572453800999-e8d2d0d05957",
      nutritionInfo: "280 cal | 6g protein | 12g fat"
    },
    {
      title: "Lebanese Fattoush Salad",
      description: "Crispy pita, fresh vegetables, and sumac dressing. Light and refreshing with Middle Eastern flavors.",
      image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd",
      nutritionInfo: "320 cal | 8g protein | 14g fat"
    },
    {
      title: "Swiss Alpine Rösti",
      description: "Crispy potato cake with mushrooms and raclette cheese. Hearty comfort food with vegetables.",
      image: "https://images.unsplash.com/photo-1558401391-7899b4bd5bbf",
      nutritionInfo: "520 cal | 16g protein | 28g fat"
    },
    {
      title: "Korean Army Stew",
      description: "Spicy fusion stew with kimchi, spam, and ramen noodles. Warming and satisfying comfort food.",
      image: "https://images.unsplash.com/photo-1550367363-9553f6275772",
      nutritionInfo: "560 cal | 24g protein | 22g fat"
    },
    {
      title: "Argentinian Chimichurri Steak",
      description: "Grilled steak with herb sauce and roasted vegetables. High protein with bold flavors.",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947",
      nutritionInfo: "620 cal | 42g protein | 26g fat"
    }
  ]
};

async function generateRecommendations(user: any) {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not configured, using fallback recommendations');
    return fallbackRecommendations;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `As an expert culinary AI, create personalized meal recommendations based on this user's profile:

    Current Mood: ${user.mood_history.current.current}
    Energy Level: ${user.mood_history.current.energy}/10
    Health Profile:
    - Activity Level: ${user.health_profile.activityLevel}
    - Dietary Restrictions: ${user.health_profile.dietaryRestrictions.join(', ') || 'None'}
    - Health Goals: ${user.health_profile.healthGoals.join(', ') || 'Not specified'}

    Food Preferences:
    - Spice Level: ${user.preferences.spiceLevel}/5
    - Preferred Portion Size: ${user.preferences.mealSize}

    Consider their current mood and energy level to suggest meals that will help maintain or improve their state.
    For each meal, provide:
    1. A creative and appealing name
    2. A detailed description explaining why it matches their profile
    3. Nutritional information
    4. A relevant food category for image selection

    Return exactly 3 recommendations in this JSON format:
    {
      "recommendations": [
        {
          "title": "Meal Name",
          "description": "Detailed description",
          "image": "URL to a relevant Unsplash image",
          "nutritionInfo": "Calories and macros"
        }
      ]
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const aiRecommendations = JSON.parse(text);

      // Validate the AI response structure
      if (!aiRecommendations.recommendations || !Array.isArray(aiRecommendations.recommendations)) {
        console.warn('Invalid AI response structure, using fallback recommendations');
        return fallbackRecommendations;
      }

      // Ensure each recommendation has required fields
      const validRecommendations = aiRecommendations.recommendations.every((rec: { 
        title: string; 
        description: string; 
        nutritionInfo: string;
      }) => 
        rec.title && rec.description && rec.nutritionInfo
      );

      if (!validRecommendations) {
        console.warn('Invalid recommendation format from AI, using fallback recommendations');
        return fallbackRecommendations;
      }

      return aiRecommendations;
    } catch (parseError) {
      console.error('Failed to parse Gemini AI response:', parseError);
      return fallbackRecommendations;
    }
  } catch (error) {
    console.error('Error in Gemini AI generation:', error);
    return fallbackRecommendations;
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
    // Get the latest user from the database
    const result = await sql`
      SELECT * FROM users 
      ORDER BY id DESC 
      LIMIT 1;
    `;

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No user found' });
    }

    // Generate recommendations using Gemini AI
    const aiRecommendations = await generateRecommendations(result.rows[0]);

    // Combine AI recommendations with fallback recommendations for variety
    const allRecommendations = [
      ...(aiRecommendations.recommendations || []),
      ...fallbackRecommendations.recommendations
    ];

    // Randomly select a subset of recommendations
    const shuffled = allRecommendations.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 6);

    res.status(200).json(selected);
  } catch (error) {
    console.error('Error in recommendations handler:', error);
    // Return fallback recommendations on error
    const selected = fallbackRecommendations.recommendations.slice(0, 6);
    res.status(200).json(selected);
  }
}