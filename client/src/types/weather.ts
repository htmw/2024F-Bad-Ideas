// Raw API response type
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

// Our transformed response type
export type WeatherResponse = {
  city: string;
  country: string;
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
    main: string;
    description: string;
    icon: string;
  };
  pressure: number; // in hPa
  visibility: number; // in meters
  timestamp: number; // unix timestamp
};
