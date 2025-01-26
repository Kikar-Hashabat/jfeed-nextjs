import { memo } from "react";
import { State, Location, WeatherResponse } from "@/types/locations";
import LocationSelector from "../../LocationSelector";

interface WeatherDisplayProps {
  initialWeatherData: WeatherResponse;
  selectedState: State;
  selectedCity: Location;
}

const DayForecast = memo(
  ({ day }: { day: WeatherResponse["forecast"]["list"][0] }) => {
    const date = new Date(day.dt * 1000);

    return (
      <article className="p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold">
          {date.toLocaleDateString("en-US", { weekday: "long" })}
        </h3>
        <p>
          <span className="sr-only">Temperature:</span>
          {Math.round(day.main.temp)}°C
        </p>
        <p className="text-sm capitalize">{day.weather[0].description}</p>
      </article>
    );
  }
);

DayForecast.displayName = "DayForecast";

const CurrentWeather = memo(
  ({ data }: { data: WeatherResponse["current"] }) => (
    <section className="mb-12" aria-labelledby="current-weather">
      <h2 id="current-weather" className="text-2xl font-semibold mb-4">
        Current Weather
      </h2>
      <div className="bg-blue-100 p-4 rounded-lg">
        <p className="text-xl font-bold">
          <span className="sr-only">Temperature:</span>
          {Math.round(data.main.temp)}°C
        </p>
        <p className="capitalize">{data.weather[0].description}</p>
        <dl className="mt-2 space-y-1">
          <div className="text-sm text-gray-600">
            <dt className="inline">Feels like: </dt>
            <dd className="inline">{Math.round(data.main.feels_like)}°C</dd>
          </div>
          <div className="text-sm text-gray-600">
            <dt className="inline">Humidity: </dt>
            <dd className="inline">{data.main.humidity}%</dd>
          </div>
        </dl>
      </div>
    </section>
  )
);

CurrentWeather.displayName = "CurrentWeather";

function WeatherDisplay({
  initialWeatherData,
  selectedState,
  selectedCity,
}: WeatherDisplayProps) {
  const today = new Date().toISOString().split("T")[0];
  const forecastDays = initialWeatherData.forecast.list.filter(
    (_, index) => index % 8 === 0
  );

  return (
    <div role="main">
      <LocationSelector
        selectedState={selectedState}
        selectedCity={selectedCity}
        pageType="weather"
        date={today}
      />

      <CurrentWeather data={initialWeatherData.current} />

      <section aria-labelledby="forecast">
        <h2 id="forecast" className="text-2xl font-semibold mb-4">
          5-Day Forecast
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {forecastDays.map((day) => (
            <DayForecast key={day.dt} day={day} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default memo(WeatherDisplay);
