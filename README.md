# AI-Powered Meal Recommendation Platform

A dynamic meal recommendation platform powered by Gemini AI, featuring interactive 3D visualizations and intelligent food suggestions.

## Features

- Personalized meal recommendations based on user preferences and mood
- Interactive 3D visualizations using Three.js
- Real-time AI processing with Google's Gemini AI
- Responsive design with Next.js and TypeScript
- Beautiful UI components using shadcn/ui

## Tech Stack

- Next.js for the frontend and API routes
- TypeScript for type safety
- Three.js for 3D animations
- Gemini AI for intelligent recommendations
- PostgreSQL for data persistence
- Vercel for deployment

## Getting Started

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd <your-repo-name>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   POSTGRES_URL=your_postgres_url
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment Variables

- `GEMINI_API_KEY`: API key for Google's Gemini AI
- `POSTGRES_URL`: PostgreSQL database connection URL

## Deployment

This project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and it will handle the rest.

Make sure to set up the environment variables in your Vercel project settings.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
