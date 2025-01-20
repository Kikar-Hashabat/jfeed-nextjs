"use client";

import { useState } from "react";
import { WeatherResponse } from "@/types/weather";
import { State, Location } from "@/types/location";
import LocationSelector from "./LocationSelector";

interface WeatherClientProps {
  initialWeatherData: WeatherResponse;
  selectedState: State;
  selectedCity: Location;
}

export default function WeatherClient({
  initialWeatherData,
  selectedState,
  selectedCity,
}: WeatherClientProps) {
  const [weatherData] = useState<WeatherResponse>(initialWeatherData);

  return (
    <main>
      <LocationSelector
        selectedState={selectedState}
        selectedCity={selectedCity}
        pageType="weather"
        date={new Date().toISOString().split("T")[0]}
      />

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Current Weather</h2>
        <div className="bg-blue-100 p-4 rounded-lg">
          <p className="text-xl font-bold">
            {Math.round(weatherData.current.main.temp)}°C
          </p>
          <p>{weatherData.current.weather[0].description}</p>
          <p className="mt-2 text-sm text-gray-600">
            Feels like: {Math.round(weatherData.current.main.feels_like)}°C
          </p>
          <p className="text-sm text-gray-600">
            Humidity: {weatherData.current.main.humidity}%
          </p>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {weatherData.forecast.list
            .filter((_, index) => index % 8 === 0)
            .map((day) => (
              <div key={day.dt} className="p-4 bg-gray-100 rounded-lg">
                <p className="font-semibold">
                  {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                    weekday: "long",
                  })}
                </p>
                <p>{Math.round(day.main.temp)}°C</p>
                <p className="text-sm">{day.weather[0].description}</p>
              </div>
            ))}
        </div>
      </section>
    </main>
  );
}
