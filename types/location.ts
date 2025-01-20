// types/location.ts
export interface State {
  geonameid: number;
  name: string;
  slug: string;
}

interface Coordinates {
  lat: number;
  lon: number;
}

export interface Location {
  geonameid: number;
  name: string;
  slug: string;
  state: State;
  coordinates: Coordinates;
}
