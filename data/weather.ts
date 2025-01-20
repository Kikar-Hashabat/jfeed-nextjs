import axios from "axios";

interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

interface ForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
    }>;
    wind: {
      speed: number;
    };
  }>;
}

export async function getCurrentWeather(
  lat: number,
  lon: number
): Promise<WeatherResponse> {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/weather",
      {
        params: {
          lat,
          lon,
          appid: process.env.WEATHER_API_KEY,
          units: "metric",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error("Invalid API Key: Check your OpenWeatherMap API key.");
    }
    throw new Error("Failed to fetch weather data.");
  }
}

export async function getWeatherForecast(
  lat: number,
  lon: number
): Promise<ForecastResponse> {
  try {
    const response = await axios.get(
      "https://api.openweathermap.org/data/2.5/forecast",
      {
        params: {
          lat,
          lon,
          appid: process.env.WEATHER_API_KEY,
          units: "metric",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error("Invalid API Key: Check your OpenWeatherMap API key.");
    }
    throw new Error("Failed to fetch weather forecast data.");
  }
}
