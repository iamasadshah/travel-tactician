import { TravelItinerary } from '@/types/itinerary';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// Dynamically import motion components with ssr disabled
const MotionDiv = dynamic(() => import('framer-motion').then((mod) => mod.motion.div), { ssr: false });
const MotionSection = dynamic(() => import('framer-motion').then((mod) => mod.motion.section), { ssr: false });

interface StructuredItineraryProps {
  itinerary: TravelItinerary;
}

export default function StructuredItinerary({ itinerary }: StructuredItineraryProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!itinerary) return null;
  if (!isClient) {
    // Server-side or initial render
    return (
      <div className="space-y-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
        {/* Static version without animations */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            🌍 Trip Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🎯 Destination:</span>
              <span>{itinerary.overview.destination}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">⏱️ Duration:</span>
              <span>{itinerary.overview.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">📅 Dates:</span>
              <span>{itinerary.overview.startDate} - {itinerary.overview.endDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🎨 Trip Type:</span>
              <span>{itinerary.overview.tripType}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">💰 Budget Level:</span>
              <span>{itinerary.overview.budgetLevel}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400">🏨 Accommodation:</span>
              <span>{itinerary.overview.accommodation}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            📅 Day-by-Day Itinerary
          </h2>
          {Object.entries(itinerary.dailyItinerary).map(([day, activities], index) => (
            <div key={day} className="space-y-4 border-l-2 border-blue-400 pl-4">
              <h3 className="text-xl font-semibold text-blue-400">{day}</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    🌅 Morning ({activities.morning.time})
                  </h4>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    {activities.morning.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    ☀️ Afternoon ({activities.afternoon.time})
                  </h4>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    {activities.afternoon.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium flex items-center gap-2">
                    🌙 Evening ({activities.evening.time})
                  </h4>
                  <ul className="list-disc list-inside pl-4 space-y-1">
                    {activities.evening.activities.map((activity, i) => (
                      <li key={i}>{activity}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            ℹ️ Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                🌤️ Weather
              </h3>
              <p>{itinerary.additionalInfo.weather.forecast}</p>
              <p>Temperature: {itinerary.additionalInfo.weather.temperature}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                🎒 Packing Tips
              </h3>
              <ul className="list-disc list-inside pl-4">
                {itinerary.additionalInfo.packingTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                💱 Local Currency
              </h3>
              <p>Currency: {itinerary.additionalInfo.localCurrency.code}</p>
              <p>Exchange Rate: {itinerary.additionalInfo.localCurrency.exchangeRate}</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                🚗 Transportation
              </h3>
              <p>From Airport: {itinerary.additionalInfo.transportation.fromAirport}</p>
              <ul className="list-disc list-inside pl-4">
                {itinerary.additionalInfo.transportation.localTransport.map((transport, i) => (
                  <li key={i}>{transport}</li>
                ))}
              </ul>
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-medium flex items-center gap-2">
                🚨 Emergency Contacts
              </h3>
              <p>Police: {itinerary.additionalInfo.emergency.police}</p>
              <p>Ambulance: {itinerary.additionalInfo.emergency.ambulance}</p>
              {itinerary.additionalInfo.emergency.touristPolice && (
                <p>Tourist Police: {itinerary.additionalInfo.emergency.touristPolice}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Client-side render with animations
  return (
    <div className="space-y-8 bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
      {/* Trip Overview Section */}
      <MotionSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold flex items-center gap-2">
          🌍 Trip Overview
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🎯 Destination:</span>
            <span>{itinerary.overview.destination}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">⏱️ Duration:</span>
            <span>{itinerary.overview.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">📅 Dates:</span>
            <span>{itinerary.overview.startDate} - {itinerary.overview.endDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🎨 Trip Type:</span>
            <span>{itinerary.overview.tripType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">💰 Budget Level:</span>
            <span>{itinerary.overview.budgetLevel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400">🏨 Accommodation:</span>
            <span>{itinerary.overview.accommodation}</span>
          </div>
        </div>
      </MotionSection>

      {/* Day-by-Day Itinerary Section */}
      <MotionSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <h2 className="text-2xl font-bold flex items-center gap-2">
          📅 Day-by-Day Itinerary
        </h2>
        {Object.entries(itinerary.dailyItinerary).map(([day, activities], index) => (
          <div key={day} className="space-y-4 border-l-2 border-blue-400 pl-4">
            <h3 className="text-xl font-semibold text-blue-400">{day}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  🌅 Morning ({activities.morning.time})
                </h4>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  {activities.morning.activities.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  ☀️ Afternoon ({activities.afternoon.time})
                </h4>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  {activities.afternoon.activities.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  🌙 Evening ({activities.evening.time})
                </h4>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  {activities.evening.activities.map((activity, i) => (
                    <li key={i}>{activity}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </MotionSection>

      {/* Additional Information Section */}
      <MotionSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold flex items-center gap-2">
          ℹ️ Additional Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              🌤️ Weather
            </h3>
            <p>{itinerary.additionalInfo.weather.forecast}</p>
            <p>Temperature: {itinerary.additionalInfo.weather.temperature}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              🎒 Packing Tips
            </h3>
            <ul className="list-disc list-inside pl-4">
              {itinerary.additionalInfo.packingTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              💱 Local Currency
            </h3>
            <p>Currency: {itinerary.additionalInfo.localCurrency.code}</p>
            <p>Exchange Rate: {itinerary.additionalInfo.localCurrency.exchangeRate}</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              🚗 Transportation
            </h3>
            <p>From Airport: {itinerary.additionalInfo.transportation.fromAirport}</p>
            <ul className="list-disc list-inside pl-4">
              {itinerary.additionalInfo.transportation.localTransport.map((transport, i) => (
                <li key={i}>{transport}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-medium flex items-center gap-2">
              🚨 Emergency Contacts
            </h3>
            <p>Police: {itinerary.additionalInfo.emergency.police}</p>
            <p>Ambulance: {itinerary.additionalInfo.emergency.ambulance}</p>
            {itinerary.additionalInfo.emergency.touristPolice && (
              <p>Tourist Police: {itinerary.additionalInfo.emergency.touristPolice}</p>
            )}
          </div>
        </div>
      </MotionSection>
    </div>
  );
}
