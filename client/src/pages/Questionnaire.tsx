import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MoodSelector from "@/components/MoodSelector";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import { type MoodData, type HealthProfile, type Preferences } from "@shared/schema";
import ThreeBackground from "@/components/ThreeBackground";
import ParticleSystem from "@/components/ParticleSystem";

export default function Questionnaire() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mood: {
      current: "happy",
      energy: 5,
      hunger: 5,
    } as MoodData,
    health: {
      dietaryRestrictions: [],
      allergies: [],
      healthGoals: [],
      activityLevel: "moderate",
    } as HealthProfile,
    preferences: {
      cuisineTypes: [],
      spiceLevel: 3,
      mealSize: "medium",
    } as Preferences,
  });

  const mutation = useMutation({
    mutationFn: async (data: {
      preferences: Preferences;
      healthProfile: HealthProfile;
      moodHistory: { current: MoodData };
    }) => {
      await apiRequest("POST", "/api/users", data);
    },
    onSuccess: () => {
      setLocation("/recommendations");
    },
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = () => {
    mutation.mutate({
      preferences: formData.preferences,
      healthProfile: formData.health,
      moodHistory: { current: formData.mood },
    });
  };

  return (
    <div className="min-h-screen relative bg-[#2C3E50]">
      <ThreeBackground />
      <ParticleSystem />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="bg-white/90 backdrop-blur">
            <CardContent className="p-6">
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold mb-6 font-['Poppins']">How are you feeling?</h2>
                  <MoodSelector
                    selected={formData.mood.current}
                    onSelect={(mood) =>
                      setFormData((prev) => ({
                        ...prev,
                        mood: { ...prev.mood, current: mood as MoodData["current"] },
                      }))
                    }
                  />
                  <div className="mt-8">
                    <p className="mb-4 font-['Quicksand']">Energy Level (1-10)</p>
                    <Slider
                      value={[formData.mood.energy]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={([value]) =>
                        setFormData((prev) => ({
                          ...prev,
                          mood: { ...prev.mood, energy: value },
                        }))
                      }
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold mb-6 font-['Poppins']">Health Profile</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 font-['Quicksand']">Activity Level</label>
                      <Select
                        value={formData.health.activityLevel}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            health: { ...prev.health, activityLevel: value as HealthProfile["activityLevel"] },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="very_active">Very Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <h2 className="text-2xl font-bold mb-6 font-['Poppins']">Food Preferences</h2>
                  <div className="space-y-6">
                    <div>
                      <label className="block mb-2 font-['Quicksand']">Spice Level (1-5)</label>
                      <Slider
                        value={[formData.preferences.spiceLevel]}
                        min={1}
                        max={5}
                        step={1}
                        onValueChange={([value]) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: { ...prev.preferences, spiceLevel: value },
                          }))
                        }
                      />
                    </div>
                    <div>
                      <label className="block mb-2 font-['Quicksand']">Portion Size</label>
                      <Select
                        value={formData.preferences.mealSize}
                        onValueChange={(value) =>
                          setFormData((prev) => ({
                            ...prev,
                            preferences: {
                              ...prev.preferences,
                              mealSize: value as Preferences["mealSize"],
                            },
                          }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="small">Small</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="large">Large</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </motion.div>
              )}

              <div className="flex justify-between mt-8">
                {step > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                {step < 3 ? (
                  <Button className="ml-auto" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button
                    className="ml-auto bg-[#FF6B6B] hover:bg-[#FF9F68]"
                    onClick={handleSubmit}
                    disabled={mutation.isPending}
                  >
                    Get Recommendations
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
