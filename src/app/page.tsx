'use client';

import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import MultiStepForm from '@/components/MultiStepForm';
import ItineraryDisplay from '@/components/ItineraryDisplay';
import Hero from '@/components/Hero';
import BackgroundAnimation from '@/components/BackgroundAnimation';
import { generateTripPlan } from '@/utils/gemini';
import { FormData, TravelItinerary } from '@/types/itinerary';

export default function Home() {
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    try {
      setIsLoading(true);
      const generatedItinerary = await generateTripPlan(formData);
      setItinerary(generatedItinerary);
      toast.success('Trip itinerary generated successfully!');
    } catch (error) {
      toast.error('Failed to generate itinerary. Please try again.');
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
      <section className="relative py-12 px-4">
        <div className="container mx-auto">
          {!itinerary ? (
            <MultiStepForm onSubmit={handleSubmit} isLoading={isLoading} />
          ) : (
            <div className="space-y-6">
              <ItineraryDisplay itinerary={itinerary} />
              <div className="flex justify-center">
                <button
                  onClick={() => setItinerary(null)}
                  className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  Create New Itinerary
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
