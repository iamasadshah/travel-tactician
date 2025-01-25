'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlane } from 'react-icons/fa';

const airplane = {
  Icon: FaPlane,
  size: 28,
  color: 'rgba(255, 255, 255, 0.8)',
  speed: 25,
};

interface Position {
  x: number;
  y: number;
}

interface AnimatedItem {
  id: number;
  scale: number;
  size: number;
  Icon: typeof FaPlane;
  color: string;
  speed: number;
  delay: number;
  initialPosition: Position;
  targetPosition: Position;
  rotation: number;
}

const generateRandomPosition = (): Position => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
});

const calculateRotation = (start: Position, end: Position): number => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return (Math.atan2(dy, dx) * (180 / Math.PI)) - 90;
};

const createInitialAirplane = (id: number): AnimatedItem => {
  const initialPosition = { x: 0, y: 0 };
  const targetPosition = { x: 100, y: 0 };
  
  return {
    id,
    scale: 1,
    size: airplane.size,
    Icon: airplane.Icon,
    color: airplane.color,
    speed: airplane.speed,
    delay: id * 1.5,
    initialPosition,
    targetPosition,
    rotation: 0,
  };
};

export default function BackgroundAnimation() {
  const [isClient, setIsClient] = useState(false);
  const [items, setItems] = useState<AnimatedItem[]>([
    createInitialAirplane(0),
    createInitialAirplane(1),
    createInitialAirplane(2),
    createInitialAirplane(3),
  ]);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize random positions only on client side
    setItems(prevItems => 
      prevItems.map(item => {
        const initialPosition = generateRandomPosition();
        const targetPosition = generateRandomPosition();
        return {
          ...item,
          scale: 0.9 + Math.random() * 0.2,
          speed: airplane.speed + Math.random() * 5,
          initialPosition,
          targetPosition,
          rotation: calculateRotation(initialPosition, targetPosition),
        };
      })
    );
  }, []);

  const updateAirplanePosition = (item: AnimatedItem) => {
    const newTarget = generateRandomPosition();
    const newInitial = { x: item.targetPosition.x, y: item.targetPosition.y };
    return {
      ...item,
      initialPosition: newInitial,
      targetPosition: newTarget,
      rotation: calculateRotation(newInitial, newTarget),
      delay: 0,
    };
  };

  if (!isClient) {
    return null; // Return null on server-side
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {items.map((item) => (
        <motion.div
          key={item.id}
          initial={{
            x: `${item.initialPosition.x}vw`,
            y: `${item.initialPosition.y}vh`,
            scale: item.scale,
            rotate: item.rotation,
          }}
          animate={{
            x: `${item.targetPosition.x}vw`,
            y: `${item.targetPosition.y}vh`,
          }}
          transition={{
            duration: item.speed,
            delay: item.delay,
            ease: "linear",
          }}
          onAnimationComplete={() => {
            setItems(prevItems => 
              prevItems.map(prevItem => 
                prevItem.id === item.id ? updateAirplanePosition(prevItem) : prevItem
              )
            );
          }}
          className="absolute"
          style={{ position: 'absolute', left: '0', top: '0' }}
        >
          <item.Icon
            size={item.size}
            style={{ 
              color: item.color,
              display: 'block'
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
