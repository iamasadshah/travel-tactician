import { GoogleGenerativeAI } from '@google/generative-ai';

// Make sure to use the correct environment variable
const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_TRAVEL || '';

if (!apiKey) {
  console.error('Gemini API key is not configured. Please set NEXT_PUBLIC_GEMINI_API_TRAVEL in your .env.local file.');
}

const genAI = new GoogleGenerativeAI(apiKey);

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

function formatTripPlanText(text: string): string {
  return text
    // Remove asterisks
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    // Format section headers
    .replace(/^(Day \d+:)/gm, '## $1')
    .replace(/^(Morning|Afternoon|Evening):/gm, '### $1')
    // Format lists
    .replace(/^\s*•\s*/gm, '- ')
    .replace(/^\s*\*\s*/gm, '- ')
    // Add spacing
    .replace(/\n{3,}/g, '\n\n')
    // Format location names and prices
    .replace(/^([^-\n#].*?):\s/gm, '**$1**: ')
    // Clean up any remaining unnecessary formatting
    .trim();
}

export async function generateTripPlan(formData: TripFormData) {
  try {
    if (!apiKey) {
      throw new Error('API key is not configured. Please contact the administrator.');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Create a detailed travel plan for ${formData.destination}. Format the response with clear sections and NO asterisks (*).

Trip Details:
- Duration: ${formData.duration}
- Budget: $${formData.budget}
- Number of Travelers: ${formData.numberOfTravelers}
- Travel Style: ${formData.travelStyle}
- Accommodation Preference: ${formData.accommodation}
- Interests: ${formData.interests.join(', ')}
- Dietary Preferences: ${formData.dietaryPreferences}

Please provide a day-by-day itinerary including:
1. Recommended activities and attractions
2. Dining suggestions (considering dietary preferences)
3. Transportation recommendations
4. Estimated costs for activities and meals
5. Tips for the specific location

Format the response with:
- Clear day-by-day structure
- Morning, Afternoon, and Evening sections
- Bullet points for activities
- Cost estimates in USD
- Local travel tips`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return formatTripPlanText(text);
  } catch (error) {
    console.error('Error generating trip plan:', error);
    throw error;
  }
}
