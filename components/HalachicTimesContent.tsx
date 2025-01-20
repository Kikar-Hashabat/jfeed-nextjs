"use client";

import LocationSelector from "@/components/LocationSelector";
import { Location, State } from "@/types/location";

interface HalachicTimesContentProps {
  city: {
    name: string;
    slug: string;
    state: {
      name: string;
      slug: string;
    };
  };
  data: {
    location: {
      tzid: string;
    };
    times: Record<string, string>;
  };
  date: string;
}

export default function HalachicTimesContent({
  city,
  data,
  date,
}: HalachicTimesContentProps) {
  const timeLabels: Record<string, string> = {
    chatzotNight: "Midnight",
    alotHaShachar: "Dawn (Alot Hashachar)",
    misheyakir: "Earliest Tallit/Tefillin",
    misheyakirMachmir: "Latest Tallit/Tefillin",
    dawn: "Civil Dawn",
    sunrise: "Sunrise (Hanetz Hachamah)",
    sofZmanShmaMGA19Point8: "Latest Shema (MGA 19.8°)",
    sofZmanShmaMGA16Point1: "Latest Shema (MGA 16.1°)",
    sofZmanShmaMGA: "Latest Shema (MGA)",
    sofZmanShma: "Latest Shema",
    sofZmanTfillaMGA19Point8: "Latest Shacharit (MGA 19.8°)",
    sofZmanTfillaMGA16Point1: "Latest Shacharit (MGA 16.1°)",
    sofZmanTfillaMGA: "Latest Shacharit (MGA)",
    sofZmanTfilla: "Latest Shacharit",
    chatzot: "Midday",
    minchaGedola: "Earliest Mincha",
    minchaGedolaMGA: "Earliest Mincha (MGA)",
    minchaKetana: "Mincha Ketana",
    minchaKetanaMGA: "Mincha Ketana (MGA)",
    plagHaMincha: "Plag Hamincha",
    sunset: "Sunset (Shkiah)",
    beinHaShmashos: "Twilight (Bein Hashmashot)",
    tzeit7083deg: "Nightfall",
    tzeit85deg: "Nightfall (8.5°)",
    tzeit42min: "Nightfall (42 min)",
    tzeit50min: "Nightfall (50 min)",
    tzeit72min: "Nightfall (72 min)",
  };

  return (
    <>
      <LocationSelector
        selectedState={city.state as State}
        selectedCity={city as Location}
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
