// Base weather condition type
type WeatherCondition = {
  id: number;
  main: string; // Main weather condition (e.g., "Rain", "Snow", "Clear")
  description: string; // Detailed weather description
  icon: string; // Weather icon code
};

// Base temperature type
type Temperature = {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  sea_level?: number;
  grnd_level?: number;
  temp_kf?: number;
};

// Base wind type
type Wind = {
  speed: number; // in m/s
  deg: number; // in degrees
  gust?: number; // in m/s
};

// Raw API response types
export type OpenWeatherResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: WeatherCondition[];
  base: string;
  main: Temperature;
  visibility: number;
  wind: Wind;
  clouds: {
    all: number;
  };
  dt: number; // Unix timestamp
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number; // Unix timestamp
    sunset: number; // Unix timestamp
  };
  timezone: number; // Shift in seconds from UTC
  id: number;
  name: string;
  cod: number;
};

// Raw forecast API response type
export type OpenWeatherForecastResponse = {
  cod: string;
  message: number;
  cnt: number; // Number of timestamps returned
  list: Array<{
    dt: number; // Unix timestamp
    main: Temperature;
    weather: WeatherCondition[];
    clouds: {
      all: number;
    };
    wind: Wind;
    visibility: number;
    pop: number; // Probability of precipitation (0-1)
    sys: {
      pod: string; // Part of day (n - night, d - day)
    };
    dt_txt: string; // Date and time in text format
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number; // Unix timestamp
    sunset: number; // Unix timestamp
  };
};

// Transformed weather data structure for consistent use across components
export type WeatherData = {
  temperature: {
    current: number; // in Fahrenheit
    feels_like: number; // in Fahrenheit
    min: number; // in Fahrenheit
    max: number; // in Fahrenheit
  };
  humidity: number; // in percentage (0-100)
  wind: {
    speed: number; // in m/s
    degree: number; // in degrees (0-360)
  };
  weather: {
    main: string; // Main weather condition
    description: string; // Detailed weather description
    icon: string; // Weather icon code
  };
  pressure: number; // in hPa
  visibility: number; // in kilometers
  timestamp: number; // Unix timestamp in seconds
};

// Current weather response type
export type WeatherResponse = WeatherData & {
  city: string; // City name
  country: string; // Country code (ISO 3166-1 alpha-2)
};

// Daily forecast data extending weather data
export type DailyForecast = WeatherData & {
  dt_txt: string; // ISO date string (YYYY-MM-DD HH:mm:ss)
  pop: number; // Probability of precipitation (0-1)
};

// Forecast response type
export type ForecastResponse = {
  city: string; // City name
  country: string; // Country code (ISO 3166-1 alpha-2)
  forecast: DailyForecast[];
};

// API error response type
export type WeatherErrorResponse = {
  error: string; // Error message
  status?: number; // HTTP status code
};
