// Raw API response types
export type OpenWeatherResponse = {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
};

// Raw forecast API response type
export type OpenWeatherForecastResponse = {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
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
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    pop: number;
    sys: {
      pod: string;
    };
    dt_txt: string;
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
    sunrise: number;
    sunset: number;
  };
};

// Common weather data structure
export type WeatherData = {
  temperature: {
    current: number; // in Celsius
    feels_like: number; // in Celsius
    min: number; // in Celsius
    max: number; // in Celsius
  };
  humidity: number; // in percentage
  wind: {
    speed: number; // in m/s
    degree: number; // in degrees
  };
  weather: {
    main: string; // Main weather condition (e.g., "Rain", "Snow", "Clear")
    description: string; // Detailed weather description
    icon: string; // Weather icon code
  };
  pressure: number; // in hPa
  visibility: number; // in kilometers
  timestamp: number; // unix timestamp
};

// Current weather response type
export type WeatherResponse = WeatherData & {
  city: string; // City name
  country: string; // Country code (e.g., "US", "GB")
};

// Forecast response type
export type ForecastResponse = {
  city: string; // City name
  country: string; // Country code (e.g., "US", "GB")
  forecast: Array<
    WeatherData & {
      dt_txt: string; // Date/time text (e.g., "2024-03-19 12:00:00")
      pop: number; // Probability of precipitation (0-1)
    }
  >;
};

// API error response type
export type WeatherErrorResponse = {
  error: string;
  status?: number;
};
