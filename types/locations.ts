export interface State {
  geonameid: number;
  name: string;
  slug: string;
}

export interface Location {
  geonameid: number;
  name: string;
  slug: string;
  state: State;
  coordinates: {
    lat: number;
    lon: number;
  };
}

export interface WeatherResponse {
  current: {
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
  };
  forecast: {
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
    }>;
  };
}

export interface WeatherCurrentResponse {
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
}

export interface WeatherForecastResponse {
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
  }>;
}

export interface HalachicTimesResponse {
  location: {
    tzid: string;
  };
  times: Record<string, string>;
}

export interface ShabbatTimesResponse {
  location: {
    tzid: string;
  };
  items: Array<{
    category?: string;
    title?: string;
    date?: string;
    hdate?: string;
    hebrew?: string;
    leyning?: {
      torah: string;
      haftarah: string;
    };
  }>;
}
