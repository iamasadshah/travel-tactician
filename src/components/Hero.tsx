import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';
import Image from 'next/image';

// Dynamically import motion components with ssr disabled
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });
const MotionH1 = dynamic(() => import('framer-motion').then((mod) => mod.motion.h1), { ssr: false });
const MotionP = dynamic(() => import('framer-motion').then((mod) => mod.motion.p), { ssr: false });

export default function Hero() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: 'url(/hero-bg.jpg)',
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-900/90" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-2">
            <Image
              src="/globe-icon.gif"
              alt="Globe Icon"
              width={32}
              height={32}
              style={{ objectFit: 'contain' }}
            />
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Travel Tactician
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-8">
            Your AI-Powered Travel Companion
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Background with fixed positioning */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(/hero-bg.jpg)',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-slate-900/90" />
      </div>

      {/* Content */}
      <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <MotionDiv
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-2"
        >
          <Image
            src="/globe-icon.gif"
            alt="Globe Icon"
            width={32}
            height={32}
            style={{ objectFit: 'contain' }}
          />
        </MotionDiv>

        <MotionH1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Travel Tactician
          {/* <span className="block text-blue-400">Begins Here</span> */}
        </MotionH1>

        <MotionP
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-xl sm:text-2xl md:text-3xl text-gray-200 mb-8 max-w-3xl mx-auto"
        >
          Smart AI travel planning that fits your style, budget, and schedule seamlessly.
        </MotionP>

        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center mt-12"
        >
          <MotionDiv
            animate={{
              y: [0, 10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-white/80 cursor-pointer hover:text-blue-400 transition-colors"
            onClick={() => {
              window.scrollTo({
                top: window.innerHeight,
                behavior: 'smooth'
              });
            }}
          >
            <FaArrowDown className="text-3xl sm:text-4xl" />
          </MotionDiv>
        </MotionDiv>
      </MotionDiv>
    </div>
  );
}
