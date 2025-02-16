import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import FoodCard from "@/components/FoodCard";
import ThreeBackground from "@/components/ThreeBackground";
import ParticleSystem from "@/components/ParticleSystem";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

interface Recommendation {
  title: string;
  description: string;
  image: string;
  nutritionInfo: string;
}

export default function Recommendations() {
  const { data: recommendations, isLoading } = useQuery<Recommendation[]>({
    queryKey: ["/api/recommendations"],
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen relative bg-[#2C3E50]">
      <ThreeBackground />
      <ParticleSystem />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4 text-white font-['Poppins']">
            Your Personalized Recommendations
          </h1>
          <p className="text-[#4ECDC4] text-xl font-['Quicksand']">
            Based on your mood, health profile, and preferences
          </p>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-96 bg-white/10 animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {recommendations?.map((recommendation, index) => (
              <FoodCard
                key={index}
                title={recommendation.title}
                description={recommendation.description}
                image={recommendation.image}
                nutritionInfo={recommendation.nutritionInfo}
              />
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link href="/questionnaire">
            <Button
              variant="outline"
              className="bg-[#FF6B6B] hover:bg-[#FF9F68] text-white border-none"
            >
              Get New Recommendations
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
