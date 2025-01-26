'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlane, FaMapMarkerAlt } from 'react-icons/fa';

const locationMarker = {
  Icon: FaMapMarkerAlt,
  size: 24,
  color: 'rgba(255, 255, 255, 0.8)',
  fadeSpeed: 10,
};

const airplane = {
  Icon: FaPlane,
  size: 28,
  color: 'rgba(255, 255, 255, 0.8)',
  speed: 20, 
  delay: 8, 
};

interface Position {
  x: number;
  y: number;
}

type ItemType = 'location' | 'airplane';

interface AnimatedItem {
  id: number;
  type: ItemType;
  scale: number;
  size: number;
  Icon: typeof FaMapMarkerAlt | typeof FaPlane;
  color: string;
  speed: number;
  position: Position;
}

interface AirplaneConfig {
  id: number;
  initialPosition: Position;
  targetPosition: Position;
  rotation: number;
  active: boolean;
}

const generateRandomPosition = (): Position => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
});

const createLocationMarker = (id: number): AnimatedItem => {
  return {
    id,
    type: 'location',
    scale: 1,
    size: locationMarker.size,
    Icon: locationMarker.Icon,
    color: locationMarker.color,
    speed: locationMarker.fadeSpeed,
    position: generateRandomPosition(),
  };
};

const airplaneConfigs: AirplaneConfig[] = [
  {
    id: 1,
    initialPosition: { x: -10, y: -10 },
    targetPosition: { x: 110, y: 110 },
    rotation: 45,
    active: false,
  },
  {
    id: 2,
    initialPosition: { x: -10, y: 110 },
    targetPosition: { x: 110, y: -10 },
    rotation: -45,
    active: false,
  },
  {
    id: 3,
    initialPosition: { x: -10, y: 50 },
    targetPosition: { x: 110, y: 50 },
    rotation: 0,
    active: false,
  },
];

export default function BackgroundAnimation() {
  const [isClient, setIsClient] = useState(false);
  const [locationItems, setLocationItems] = useState<AnimatedItem[]>([
    createLocationMarker(1),
    createLocationMarker(2),
    createLocationMarker(3),
    createLocationMarker(4),
  ]);
  const [activeAirplanes, setActiveAirplanes] = useState<AirplaneConfig[]>(airplaneConfigs);

  useEffect(() => {
    setIsClient(true);

    const locationInterval = setInterval(() => {
      setLocationItems(prevItems =>
        prevItems.map(item => ({
          ...item,
          position: generateRandomPosition(),
        }))
      );
    }, 5000);

    const activateAirplane = () => {
      setActiveAirplanes(prev => {
        const inactiveAirplanes = prev.filter(a => !a.active);
        if (inactiveAirplanes.length === 0) {
          return prev.map(a => ({ ...a, active: false }));
        }
        
        const randomIndex = Math.floor(Math.random() * inactiveAirplanes.length);
        const selectedAirplane = inactiveAirplanes[randomIndex];
        
        return prev.map(airplane => 
          airplane.id === selectedAirplane.id
            ? { ...airplane, active: true }
            : airplane
        );
      });
    };

    const initialDelay = Math.random() * 3000;
    setTimeout(() => {
      activateAirplane();
      const airplaneInterval = setInterval(activateAirplane, airplane.delay * 1000);
      return () => clearInterval(airplaneInterval);
    }, initialDelay);

    return () => {
      clearInterval(locationInterval);
    };
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[1]">
      {locationItems.map((item) => (
        <motion.div
          key={item.id}
          initial={{
            x: `${item.position.x}vw`,
            y: `${item.position.y}vh`,
            scale: item.scale,
            opacity: 0,
          }}
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: item.speed,
            ease: "easeInOut",
            opacity: {
              repeat: Infinity,
              duration: item.speed,
              ease: "easeInOut"
            }
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

      {activeAirplanes.map((config) => 
        config.active && (
          <motion.div
            key={`airplane-${config.id}`}
            initial={{
              x: `${config.initialPosition.x}vw`,
              y: `${config.initialPosition.y}vh`,
              rotate: config.rotation,
              opacity: 0,
            }}
            animate={{
              x: `${config.targetPosition.x}vw`,
              y: `${config.targetPosition.y}vh`,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: airplane.speed,
              ease: "linear",
              opacity: {
                times: [0, 0.1, 0.9, 1],
                duration: airplane.speed,
              }
            }}
            onAnimationComplete={() => {
              setActiveAirplanes(prev =>
                prev.map(a =>
                  a.id === config.id ? { ...a, active: false } : a
                )
              );
            }}
            className="absolute"
          >
            <airplane.Icon
              size={airplane.size}
              style={{ 
                color: airplane.color,
                display: 'block'
              }}
            />
          </motion.div>
        )
      )}
    </div>
  );
}
