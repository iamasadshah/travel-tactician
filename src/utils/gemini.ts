import { GoogleGenerativeAI } from '@google/generative-ai';
import { TravelItinerary, FormData } from '@/types/itinerary';
import { getDestinationData } from './externalData';

// Make sure to use the correct environment variable
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_TRAVEL || '';

if (!apiKey) {
  console.error('Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_TRAVEL in your .env.local file.');
}

const genAI = new GoogleGenerativeAI(apiKey);

export async function generateTripPlan(formData: FormData): Promise<TravelItinerary> {
  try {
    if (!apiKey) {
      throw new Error('API key is not configured. Please contact the administrator.');
    }

    // Fetch real-time destination data
    const destinationData = await getDestinationData(formData.destination);

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Generate a detailed travel itinerary for the following trip:
Destination: ${formData.destination}
Dates: ${formData.startDate?.toLocaleDateString()} - ${formData.endDate?.toLocaleDateString()}
Budget Level: ${formData.budget}
Accommodation: ${formData.accommodation}
Number of Travelers: ${formData.travelers}
Dietary Preferences: ${formData.dietaryPlan}

Please provide a structured travel itinerary that includes:
1. A trip overview with all the above details
2. A day-by-day itinerary with activities for morning, afternoon, and evening
3. Additional information including weather forecast, packing tips, local currency, transportation options, and emergency contacts

The response should be in a structured JSON format matching this TypeScript interface:

interface TravelItinerary {
  trip_overview: {
    destination: string;
    dates: string;
    duration: string;
    budget_level: string;
    accommodation: string;
    travelers: string;
    dietary_plan: string;
  };
  itinerary: Array<{
    day: number;
    morning: string[];
    afternoon: string[];
    evening: string[];
  }>;
  additional_info: {
    weather_forecast: string;
    packing_tips: string[];
    local_currency: {
      code: string;
      exchangeRate: string;
    };
    transportation: string[];
    emergency: {
      police: string;
      ambulance: string;
      touristPolice: string | undefined;
    };
  };
}

Please ensure all activities are appropriate for the specified budget level and number of travelers.
Include emoji icons where appropriate for better readability.
Make sure all dining recommendations align with the specified dietary preferences.
Ensure the itinerary is properly paced and includes a mix of activities.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      console.log('Raw AI response:', text);  
      
      // Extract the JSON object from the response
      const jsonStr = text.substring(
        text.indexOf('{'),
        text.lastIndexOf('}') + 1
      );
      
      console.log('Extracted JSON:', jsonStr);  
      
      const itinerary: TravelItinerary = JSON.parse(jsonStr);
      
      // Override the real-time data to ensure accuracy
      itinerary.additional_info.weather_forecast = destinationData.weather.forecast;
      itinerary.additional_info.local_currency = {
        code: destinationData.currency.code,
        exchangeRate: parseFloat(destinationData.currency.exchangeRate)
      };
      itinerary.additional_info.emergency = {
        police: destinationData.emergency.police,
        ambulance: destinationData.emergency.ambulance,
        touristPolice: destinationData.emergency.touristPolice || undefined
      };
      
      return itinerary;
    } catch (error) {
      console.error('Error generating trip plan:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
        console.error('Error stack:', error.stack);
      }
      throw new Error('Failed to generate trip plan');
    }
  } catch (error) {
    console.error('Error generating trip plan:', error);
    throw new Error('Failed to generate trip plan');
  }
}
