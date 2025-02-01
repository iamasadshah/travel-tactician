import { GoogleGenerativeAI } from '@google/generative-ai';
import { TravelItinerary, TripFormData } from '@/types/itinerary';
import { getDestinationData } from './externalData';

// Make sure to use the correct environment variable
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_TRAVEL || '';

if (!apiKey) {
  console.error('Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_TRAVEL in your .env.local file.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateTripPlan(formData: TripFormData): Promise<TravelItinerary> {
  try {
    if (!apiKey) {
      throw new Error('API key is not configured. Please contact the administrator.');
    }

    // Fetch real-time destination data
    const destinationData = await getDestinationData(formData.destination);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a detailed travel itinerary for the following trip:
    Destination: ${formData.destination}
    Duration: ${formData.duration}
    Budget: ${formData.budget}
    Interests: ${formData.interests.join(', ')}
    Travel Style: ${formData.travelStyle}
    Accommodation Preference: ${formData.accommodation}
    Number of Travelers: ${formData.numberOfTravelers}
    Dietary Preferences: ${formData.dietaryPreferences}

    Use this REAL-TIME data in your response:
    Current Weather: ${destinationData.weather.forecast}, ${destinationData.weather.temperature}
    Local Currency: ${destinationData.currency.code}
    Current Exchange Rate: ${destinationData.currency.exchangeRate}
    Emergency Contacts:
    - Police: ${destinationData.emergency.police}
    - Ambulance: ${destinationData.emergency.ambulance}
    ${destinationData.emergency.touristPolice ? `- Tourist Police: ${destinationData.emergency.touristPolice}` : ''}

    Return ONLY a valid JSON object (no markdown, no backticks) that exactly matches this TypeScript interface:

    interface TravelItinerary {
      overview: {
        destination: string;
        duration: string;
        startDate: string;    // Use realistic dates starting from today
        endDate: string;      // Calculate based on duration
        tripType: string;     // Based on interests and travel style
        budgetLevel: string;  // Format as "Budget", "Moderate", or "Luxury"
        accommodation: string;
      };
      dailyItinerary: {
        [key: string]: {     // Keys should be "Day 1", "Day 2", etc.
          morning: {
            activities: string[];  // Array of 2-3 activities
            time: string;         // e.g. "9:00 AM - 12:00 PM"
          };
          afternoon: {
            activities: string[];  // Array of 2-3 activities
            time: string;         // e.g. "12:00 PM - 4:00 PM"
          };
          evening: {
            activities: string[];  // Array of 2-3 activities
            time: string;         // e.g. "4:00 PM - 8:00 PM"
          };
        };
      };
      additionalInfo: {
        weather: {
          forecast: string;    // Use the provided real-time weather
          temperature: string; // Use the provided real-time temperature
        };
        packingTips: string[];           // Array of packing suggestions based on weather
        localCurrency: {
          code: string;                  // Use the provided currency code
          exchangeRate: string;          // Use the provided real-time exchange rate
        };
        transportation: {
          fromAirport: string;          // How to get from airport to accommodation
          localTransport: string[];     // Array of local transportation options
        };
        emergency: {
          police: string;               // Use the provided emergency number
          ambulance: string;            // Use the provided emergency number
          touristPolice?: string;       // Use the provided tourist police number if available
        };
      };
    }`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    // Clean the response text to handle potential markdown formatting
    text = text.replace(/```json\n?|\n?```/g, '').trim();
    
    try {
      // Parse the JSON response
      const itinerary: TravelItinerary = JSON.parse(text);
      
      // Override the real-time data to ensure accuracy
      itinerary.additionalInfo.weather = destinationData.weather;
      itinerary.additionalInfo.localCurrency = destinationData.currency;
      itinerary.additionalInfo.emergency = destinationData.emergency;
      
      // Validate the required structure
      if (!itinerary.overview || !itinerary.dailyItinerary || !itinerary.additionalInfo) {
        throw new Error('Invalid itinerary structure: missing top-level properties');
      }

      // Validate overview properties
      const requiredOverviewProps = ['destination', 'duration', 'startDate', 'endDate', 'tripType', 'budgetLevel', 'accommodation'] as const;
      for (const prop of requiredOverviewProps) {
        if (!(prop in itinerary.overview)) {
          throw new Error(`Invalid itinerary structure: missing overview.${prop}`);
        }
      }

      // Validate daily itinerary
      const days = Object.entries(itinerary.dailyItinerary);
      if (days.length === 0) {
        throw new Error('Invalid itinerary structure: dailyItinerary is empty');
      }

      for (const [day, activities] of days) {
        // Validate morning activities
        if (!activities.morning?.activities?.length || !activities.morning.time) {
          throw new Error(`Invalid itinerary structure: missing or invalid morning activities for ${day}`);
        }
        // Validate afternoon activities
        if (!activities.afternoon?.activities?.length || !activities.afternoon.time) {
          throw new Error(`Invalid itinerary structure: missing or invalid afternoon activities for ${day}`);
        }
        // Validate evening activities
        if (!activities.evening?.activities?.length || !activities.evening.time) {
          throw new Error(`Invalid itinerary structure: missing or invalid evening activities for ${day}`);
        }
      }

      // Validate additional info
      if (!itinerary.additionalInfo.weather?.forecast || !itinerary.additionalInfo.weather?.temperature) {
        throw new Error('Invalid itinerary structure: missing weather information');
      }
      if (!Array.isArray(itinerary.additionalInfo.packingTips) || itinerary.additionalInfo.packingTips.length === 0) {
        throw new Error('Invalid itinerary structure: missing packing tips');
      }
      if (!itinerary.additionalInfo.localCurrency?.code || !itinerary.additionalInfo.localCurrency?.exchangeRate) {
        throw new Error('Invalid itinerary structure: missing local currency information');
      }
      if (!itinerary.additionalInfo.transportation?.fromAirport || !Array.isArray(itinerary.additionalInfo.transportation?.localTransport)) {
        throw new Error('Invalid itinerary structure: missing transportation information');
      }
      if (!itinerary.additionalInfo.emergency?.police || !itinerary.additionalInfo.emergency?.ambulance) {
        throw new Error('Invalid itinerary structure: missing emergency contact information');
      }

      return itinerary;
    } catch (error) {
      console.error('Error parsing or validating itinerary:', error);
      throw new Error(error instanceof Error ? error.message : 'Failed to generate a valid itinerary. Please try again.');
    }
  } catch (error) {
    console.error('Error generating trip plan:', error);
    throw new Error('Failed to generate trip plan');
  }
}
