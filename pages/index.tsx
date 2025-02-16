import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ThreeBackground from '@/components/ThreeBackground';
import ParticleSystem from '@/components/ParticleSystem';

const Home: NextPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-[#2C3E50]">
      <Head>
        <title>Food Journey | Your Personal Food Recommendations</title>
        <meta name="description" content="Get personalized food recommendations based on your mood and preferences" />
      </Head>

      <ThreeBackground />
      <ParticleSystem />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-5xl font-bold mb-6 text-white font-['Poppins']">
            Your Personal Food Journey
          </h1>
          <p className="text-xl mb-8 text-[#4ECDC4] font-['Quicksand']">
            Discover meals that match your mood, health, and cravings
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="max-w-md mx-auto"
        >
          <Card className="bg-white/90 backdrop-blur">
            <CardContent className="p-6">
              <Link href="/questionnaire">
                <Button 
                  className="w-full bg-[#FF6B6B] hover:bg-[#FF9F68] text-white"
                  size="lg"
                >
                  Start Your Journey
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2
              }
            }
          }}
          initial="hidden"
          animate="show"
        >
          {[
            {
              title: "Mood-Based",
              description: "Get recommendations that match how you feel",
              image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            },
            {
              title: "Health-Conscious",
              description: "Tailored to your dietary needs and goals",
              image: "https://images.unsplash.com/photo-1454944338482-a69bb95894af"
            },
            {
              title: "AI-Powered",
              description: "Smart suggestions that learn your preferences",
              image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601"
            }
          ].map((feature, i) => (
            <motion.div
              key={i}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
            >
              <Card className="overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-4">
                  <h3 className="text-xl font-bold mb-2 font-['Poppins']">{feature.title}</h3>
                  <p className="text-gray-600 font-['Quicksand']">{feature.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
