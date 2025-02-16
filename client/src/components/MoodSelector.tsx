import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const moods = [
  { emoji: '😊', name: 'happy', color: '#FFE66D' },
  { emoji: '😔', name: 'sad', color: '#4ECDC4' },
  { emoji: '😫', name: 'stressed', color: '#FF6B6B' },
  { emoji: '⚡', name: 'energetic', color: '#FF9F68' },
  { emoji: '😴', name: 'tired', color: '#2C3E50' }
];

interface MoodSelectorProps {
  onSelect: (mood: string) => void;
  selected?: string;
}

export default function MoodSelector({ onSelect, selected }: MoodSelectorProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {moods.map((mood) => (
        <motion.div
          key={mood.name}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button
            variant={selected === mood.name ? "default" : "outline"}
            className={`w-full h-24 flex flex-col items-center justify-center gap-2 font-['Quicksand']`}
            style={{
              backgroundColor: selected === mood.name ? mood.color : 'transparent',
              borderColor: mood.color,
              color: selected === mood.name ? 'white' : 'inherit'
            }}
            onClick={() => onSelect(mood.name)}
          >
            <span className="text-3xl">{mood.emoji}</span>
            <span className="capitalize">{mood.name}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
}
