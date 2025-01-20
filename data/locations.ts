export const locations = {
  states: [
    { geonameid: 294640, name: "Israel", slug: "il" },
    { geonameid: 6252001, name: "United States", slug: "us" },
    { geonameid: 2635167, name: "United Kingdom", slug: "uk" },
    { geonameid: 6251999, name: "Canada", slug: "ca" },
    { geonameid: 2077456, name: "Australia", slug: "au" },
    { geonameid: 953987, name: "South Africa", slug: "za" },
    { geonameid: 3017382, name: "France", slug: "fr" },
    { geonameid: 2921044, name: "Germany", slug: "de" },
    { geonameid: 3865483, name: "Argentina", slug: "ar" },
    { geonameid: 3057568, name: "Hungary", slug: "hu" },
    { geonameid: 2510769, name: "Spain", slug: "es" },
    { geonameid: 3175395, name: "Italy", slug: "it" },
  ],

  cities: [
    // Israel - Major Cities
    {
      geonameid: 281184,
      name: "Jerusalem",
      slug: "jerusalem",
      state: { geonameid: 294640, name: "Israel", slug: "il" },
      coordinates: { lat: 31.7683, lon: 35.2137 },
    },
    {
      geonameid: 293397,
      name: "Tel Aviv",
      slug: "tel-aviv",
      state: { geonameid: 294640, name: "Israel", slug: "il" },
      coordinates: { lat: 32.0853, lon: 34.7818 },
    },
    {
      geonameid: 294801,
      name: "Haifa",
      slug: "haifa",
      state: { geonameid: 294640, name: "Israel", slug: "il" },
      coordinates: { lat: 32.794, lon: 34.9896 },
    },
    {
      geonameid: 294999,
      name: "Bnei Brak",
      slug: "bnei-brak",
      state: { geonameid: 294640, name: "Israel", slug: "il" },
      coordinates: { lat: 32.081, lon: 34.8337 },
    },
    {
      geonameid: 293918,
      name: "Petah Tikva",
      slug: "petah-tikva",
      state: { geonameid: 294640, name: "Israel", slug: "il" },
      coordinates: { lat: 32.0868, lon: 34.8867 },
    },
    {
      geonameid: 295629,
      name: "Ashdod",
      slug: "ashdod",
      state: { geonameid: 294640, name: "Israel", slug: "il" },
      coordinates: { lat: 31.792, lon: 34.6497 },
    },
    {
      geonameid: 293322,
      name: "Tiberias",
      slug: "tiberias",
      state: { geonameid: 294640, name: "Israel", slug: "il" },
      coordinates: { lat: 32.796, lon: 35.532 },
    },
    {
      geonameid: 295530,
      name: "Beersheba",
      slug: "beersheba",
      state: { geonameid: 294640, name: "Israel", slug: "il" },
      coordinates: { lat: 31.2518, lon: 34.7915 },
    },

    // United States - Major Jewish Communities
    {
      geonameid: 5128581,
      name: "New York",
      slug: "new-york",
      state: { geonameid: 6252001, name: "United States", slug: "us" },
      coordinates: { lat: 40.7128, lon: -74.006 },
    },
    {
      geonameid: 5364855,
      name: "Lakewood",
      slug: "lakewood",
      state: { geonameid: 6252001, name: "United States", slug: "us" },
      coordinates: { lat: 40.0959, lon: -74.2171 },
    },
    {
      geonameid: 5127315,
      name: "Monsey",
      slug: "monsey",
      state: { geonameid: 6252001, name: "United States", slug: "us" },
      coordinates: { lat: 41.1115, lon: -74.0687 },
    },
    {
      geonameid: 4887398,
      name: "Chicago",
      slug: "chicago",
      state: { geonameid: 6252001, name: "United States", slug: "us" },
      coordinates: { lat: 41.8781, lon: -87.6298 },
    },
    {
      geonameid: 5368361,
      name: "Los Angeles",
      slug: "los-angeles",
      state: { geonameid: 6252001, name: "United States", slug: "us" },
      coordinates: { lat: 34.0522, lon: -118.2437 },
    },
    {
      geonameid: 4930956,
      name: "Boston",
      slug: "boston",
      state: { geonameid: 6252001, name: "United States", slug: "us" },
      coordinates: { lat: 42.3601, lon: -71.0589 },
    },
    {
      geonameid: 4505716,
      name: "Baltimore",
      slug: "baltimore",
      state: { geonameid: 6252001, name: "United States", slug: "us" },
      coordinates: { lat: 39.2904, lon: -76.6122 },
    },

    // United Kingdom
    {
      geonameid: 2643743,
      name: "London",
      slug: "london",
      state: { geonameid: 2635167, name: "United Kingdom", slug: "uk" },
      coordinates: { lat: 51.5074, lon: -0.1278 },
    },
    {
      geonameid: 2643123,
      name: "Manchester",
      slug: "manchester",
      state: { geonameid: 2635167, name: "United Kingdom", slug: "uk" },
      coordinates: { lat: 53.4808, lon: -2.2426 },
    },
    {
      geonameid: 7535506,
      name: "Golders Green",
      slug: "golders-green",
      state: { geonameid: 2635167, name: "United Kingdom", slug: "uk" },
      coordinates: { lat: 51.5724, lon: -0.1955 },
    },

    // France
    {
      geonameid: 2988507,
      name: "Paris",
      slug: "paris",
      state: { geonameid: 3017382, name: "France", slug: "fr" },
      coordinates: { lat: 48.8566, lon: 2.3522 },
    },
    {
      geonameid: 2995469,
      name: "Marseille",
      slug: "marseille",
      state: { geonameid: 3017382, name: "France", slug: "fr" },
      coordinates: { lat: 43.2965, lon: 5.3698 },
    },
    {
      geonameid: 2973783,
      name: "Strasbourg",
      slug: "strasbourg",
      state: { geonameid: 3017382, name: "France", slug: "fr" },
      coordinates: { lat: 48.5734, lon: 7.7521 },
    },

    // Germany
    {
      geonameid: 2950159,
      name: "Berlin",
      slug: "berlin",
      state: { geonameid: 2921044, name: "Germany", slug: "de" },
      coordinates: { lat: 52.52, lon: 13.405 },
    },
    {
      geonameid: 6555231,
      name: "Frankfurt",
      slug: "frankfurt",
      state: { geonameid: 2921044, name: "Germany", slug: "de" },
      coordinates: { lat: 50.1109, lon: 8.6821 },
    },
    {
      geonameid: 6555232,
      name: "Munich",
      slug: "munich",
      state: { geonameid: 2921044, name: "Germany", slug: "de" },
      coordinates: { lat: 48.1351, lon: 11.582 },
    },

    // Canada
    {
      geonameid: 6167865,
      name: "Toronto",
      slug: "toronto",
      state: { geonameid: 6251999, name: "Canada", slug: "ca" },
      coordinates: { lat: 43.6532, lon: -79.3832 },
    },
    {
      geonameid: 6077243,
      name: "Montreal",
      slug: "montreal",
      state: { geonameid: 6251999, name: "Canada", slug: "ca" },
      coordinates: { lat: 45.5017, lon: -73.5673 },
    },

    // Australia
    {
      geonameid: 2147714,
      name: "Sydney",
      slug: "sydney",
      state: { geonameid: 2077456, name: "Australia", slug: "au" },
      coordinates: { lat: -33.8688, lon: 151.2093 },
    },
    {
      geonameid: 2158177,
      name: "Melbourne",
      slug: "melbourne",
      state: { geonameid: 2077456, name: "Australia", slug: "au" },
      coordinates: { lat: -37.8136, lon: 144.9631 },
    },

    // South Africa
    {
      geonameid: 3369157,
      name: "Cape Town",
      slug: "cape-town",
      state: { geonameid: 953987, name: "South Africa", slug: "za" },
      coordinates: { lat: -33.9249, lon: 18.4241 },
    },
    {
      geonameid: 993800,
      name: "Johannesburg",
      slug: "johannesburg",
      state: { geonameid: 953987, name: "South Africa", slug: "za" },
      coordinates: { lat: -26.2041, lon: 28.0473 },
    },

    // Switzerland
    {
      geonameid: 2657895,
      name: "Zurich",
      slug: "zurich",
      state: { geonameid: 2658434, name: "Switzerland", slug: "ch" },
      coordinates: { lat: 47.3769, lon: 8.5417 },
    },

    // Argentina
    {
      geonameid: 3435910,
      name: "Buenos Aires",
      slug: "buenos-aires",
      state: { geonameid: 3865483, name: "Argentina", slug: "ar" },
      coordinates: { lat: -34.6037, lon: -58.3816 },
    },

    // Hungary
    {
      geonameid: 3054643,
      name: "Budapest",
      slug: "budapest",
      state: { geonameid: 3057568, name: "Hungary", slug: "hu" },
      coordinates: { lat: 47.4979, lon: 19.0402 },
    },

    // Spain
    {
      geonameid: 3117735,
      name: "Barcelona",
      slug: "barcelona",
      state: { geonameid: 2510769, name: "Spain", slug: "es" },
      coordinates: { lat: 41.3851, lon: 2.1734 },
    },

    // Italy
    {
      geonameid: 3169070,
      name: "Rome",
      slug: "rome",
      state: { geonameid: 3175395, name: "Italy", slug: "it" },
      coordinates: { lat: 41.9028, lon: 12.4964 },
    },
  ],
};
