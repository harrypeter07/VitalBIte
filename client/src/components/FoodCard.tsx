import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface FoodCardProps {
  title: string;
  description: string;
  image: string;
  nutritionInfo?: string;
  onClick?: () => void;
}

export default function FoodCard({ 
  title, 
  description, 
  image, 
  nutritionInfo, 
  onClick 
}: FoodCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onClick}
    >
      <Card className="overflow-hidden cursor-pointer bg-white/90 backdrop-blur">
        <CardHeader className="p-0">
          <div className="relative h-48">
            <img 
              src={image} 
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <h3 className="absolute bottom-4 left-4 text-xl font-bold text-white font-['Poppins']">
              {title}
            </h3>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-gray-600 mb-2 font-['Quicksand']">{description}</p>
          {nutritionInfo && (
            <p className="text-sm text-gray-500 font-['Quicksand']">{nutritionInfo}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
