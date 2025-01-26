"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, memo } from "react";
import { locations } from "@/data/locations";
import { Location, State } from "@/types/locations";

interface LocationSelectorProps {
  selectedState: State;
  selectedCity: Location;
  pageType: "weather" | "shabbat" | "halachic";
  date: string;
}

const LocationSelector = memo(
  ({
    selectedState,
    selectedCity,
    pageType = "weather",
    date,
  }: LocationSelectorProps) => {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    const citiesInState = locations.cities.filter(
      (city) => city.state.slug === selectedState.slug
    );

    const getUrl = (state: string, city: string): string =>
      pageType === "weather"
        ? `/weather/${state}/${city}`
        : `/${pageType}-times/${state}/${city}/${date}`;

    if (!mounted) {
      return <div className="h-16" role="presentation" aria-hidden="true" />;
    }

    return (
      <div
        className="flex gap-4 mb-6"
        role="group"
        aria-label="Location selection"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="state-select" className="sr-only">
            Select State
          </label>
          <select
            id="state-select"
            value={selectedState.slug}
            onChange={(e) => {
              const newState = e.target.value;
              const firstCity = locations.cities.find(
                (city) => city.state.slug === newState
              )?.slug;

              if (firstCity) {
                router.push(getUrl(newState, firstCity));
              }
            }}
            className="p-2 border rounded-md min-w-[200px]"
            aria-label="State selection"
          >
            {locations.states.map((state) => (
              <option key={state.slug} value={state.slug}>
                {state.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="city-select" className="sr-only">
            Select City
          </label>
          <select
            id="city-select"
            value={selectedCity.slug}
            onChange={(e) => {
              router.push(getUrl(selectedState.slug, e.target.value));
            }}
            className="p-2 border rounded-md min-w-[200px]"
            aria-label="City selection"
          >
            {citiesInState.map((city) => (
              <option key={city.slug} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  }
);

LocationSelector.displayName = "LocationSelector";

export default LocationSelector;
