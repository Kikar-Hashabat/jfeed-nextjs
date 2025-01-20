// components/HalachicTimesContent.tsx
"use client";

import LocationSelector from "@/components/LocationSelector";
import { HalachicTimesResponse, Location, State } from "@/types/locations";
import { timeLabels } from "@/data/times";

interface HalachicTimesContentProps {
  city: Location;
  data: HalachicTimesResponse;
  date: string;
}

export default function HalachicTimesContent({
  city,
  data,
  date,
}: HalachicTimesContentProps) {
  return (
    <>
      <LocationSelector
        selectedState={city.state as State}
        selectedCity={city}
        pageType="halachic"
        date={date}
      />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">
          {city.name}, {city.state.name}
        </h2>
        <p className="text-gray-600 mb-4">
          Times shown in: {data.location.tzid}
        </p>

        <div className="space-y-2">
          {Object.entries(timeLabels).map(
            ([key, label]) =>
              data.times[key] && (
                <div key={key} className="flex justify-between py-2 border-b">
                  <strong>{label}</strong>
                  <span>{data.times[key].slice(11, 16)}</span>
                </div>
              )
          )}
        </div>
      </div>
    </>
  );
}
