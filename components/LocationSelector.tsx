"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { locations } from "@/data/locations";
import { Location, State } from "@/types/location";

interface LocationSelectorProps {
  selectedState: State;
  selectedCity: Location;
  pageType: "weather" | "shabbat" | "halachic";
  date: string;
}

export default function LocationSelector({
  selectedState,
  selectedCity,
  pageType = "weather",
  date,
}: LocationSelectorProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-16" />; // Placeholder height to prevent layout shift
  }

  const citiesInState = locations.cities.filter(
    (city) => city.state.slug === selectedState.slug
  );

  const getUrl = (state: string, city: string) => {
    if (pageType === "weather") return `/weather/${state}/${city}`;
    return `/${pageType}-times/${state}/${city}/${date}`;
  };

  return (
    <div className="flex gap-4 mb-6">
      <select
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
        className="p-2 border rounded-md"
      >
        {locations.states.map((state) => (
          <option key={state.slug} value={state.slug}>
            {state.name}
          </option>
        ))}
      </select>

      <select
        value={selectedCity.slug}
        onChange={(e) => {
          router.push(getUrl(selectedState.slug, e.target.value));
        }}
        className="p-2 border rounded-md"
      >
        {citiesInState.map((city) => (
          <option key={city.slug} value={city.slug}>
            {city.name}
          </option>
        ))}
      </select>
    </div>
  );
}
