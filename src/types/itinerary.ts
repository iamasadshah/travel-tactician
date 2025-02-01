export interface DayActivity {
  morning: {
    activities: string[];
    time: string;
  };
  afternoon: {
    activities: string[];
    time: string;
  };
  evening: {
    activities: string[];
    time: string;
  };
}

export interface TripOverview {
  destination: string;
  duration: string;
  startDate: string;
  endDate: string;
  tripType: string;
  budgetLevel: string;
  accommodation: string;
}

export interface AdditionalInfo {
  weather: {
    forecast: string;
    temperature: string;
  };
  packingTips: string[];
  localCurrency: {
    code: string;
    exchangeRate: string;
  };
  transportation: {
    fromAirport: string;
    localTransport: string[];
  };
  emergency: {
    police: string;
    ambulance: string;
    touristPolice?: string;
  };
}

export interface TravelItinerary {
  overview: TripOverview;
  dailyItinerary: Record<string, DayActivity>;
  additionalInfo: AdditionalInfo;
}

export interface TripFormData {
  destination: string;
  duration: string;
  budget: number;
  interests: string[];
  travelStyle: string;
  accommodation: string;
  email: string;
  numberOfTravelers: number;
  dietaryPreferences: string[];
}
