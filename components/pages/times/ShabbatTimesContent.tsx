// components/ShabbatTimesContent.tsx
"use client";

import LocationSelector from "@/components/LocationSelector";
import { Location, ShabbatTimesResponse, State } from "@/types/locations";

interface ShabbatTimesContentProps {
  city: Location;
  data: ShabbatTimesResponse;
  date: string;
}

export default function ShabbatTimesContent({
  city,
  data,
  date,
}: ShabbatTimesContentProps) {
  return (
    <>
      <LocationSelector
        selectedState={city.state as State}
        selectedCity={city}
        pageType="shabbat"
        date={date}
      />

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">
          {city.name}, {city.state.name}
        </h2>
        <p className="text-gray-600 mb-4">
          Times shown in: {data.location.tzid}
        </p>

        <div className="space-y-4">
          {data.items[2] && (
            <>
              <h3 className="text-xl font-semibold">{data.items[2].title}</h3>
              <p className="text-gray-600">{data.items[2].hdate}</p>
            </>
          )}

          {data.items.map((item, index) => (
            <div key={index}>
              {item.category === "candles" && (
                <div className="flex justify-between py-2 border-b">
                  <strong>Candle Lighting:</strong>
                  <span>{item.date?.slice(11, 16)}</span>
                </div>
              )}

              {item.category === "havdalah" && (
                <div className="flex justify-between py-2 border-b">
                  <strong>Havdalah:</strong>
                  <span>{item.date?.slice(11, 16)}</span>
                </div>
              )}
            </div>
          ))}

          {data.items[2]?.leyning && (
            <div className="mt-6 space-y-2">
              <h4 className="text-lg font-semibold">Torah Reading</h4>
              <p>
                <strong>Parashat:</strong> {data.items[2].hebrew}
              </p>
              <p>
                <strong>Torah:</strong> {data.items[2].leyning.torah}
              </p>
              <p>
                <strong>Haftarah:</strong> {data.items[2].leyning.haftarah}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
