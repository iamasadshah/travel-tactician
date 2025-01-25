'use client';

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import TravelForm from '@/components/TravelForm';
import TripPlan from '@/components/TripPlan';
import Hero from '@/components/Hero';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import { generateTripPlan } from '@/utils/gemini';

interface TripFormData {
  destination: string;
  duration: string;
  budget: number;
  interests: string[];
  travelStyle: string;
  accommodation: string;
  email: string;
  numberOfTravelers: number;
  dietaryPreferences: string;
}

export default function Home() {
  const [tripPlan, setTripPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: TripFormData) => {
    try {
      setIsLoading(true);
      const plan = await generateTripPlan(formData);
      setTripPlan(plan);
      toast.success('Trip plan generated successfully!');
    } catch (error) {
      toast.error('Failed to generate trip plan. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-900 relative">
      <Toaster position="top-center" />
      <BackgroundAnimation />
      
      {/* Hero Section */}
      <section className="relative">
        <Hero />
      </section>

      {/* Form Section */}
      <section className="relative z-10 py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto space-y-16">
            <TravelForm onSubmit={handleSubmit} />
            <TripPlan plan={tripPlan} isLoading={isLoading} />
          </div>
        </div>
      </section>
    </main>
  );
}
