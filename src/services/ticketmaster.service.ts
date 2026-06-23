const TICKETMASTER_API_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

export type TicketmasterEvent = {
  id: string;
  name: string;
  date: string;
  city: string;
  venue: string;
  image: string | null;
  url: string | null;
};

type TicketmasterSearchParams = {
  artist?: string;
  city?: string;
};

type TicketmasterApiEvent = {
  id: string;
  name: string;
  url?: string;
  dates?: {
    start?: {
      localDate?: string;
    };
  };
  images?: Array<{
    url: string;
    width?: number;
  }>;
  place?: {
    city?: {
      name?: string;
    };
    state?: {
      name?: string;
      stateCode?: string;
    };
  };
  _embedded?: {
    venues?: Array<{
      name?: string;
      city?: {
        name?: string;
      };
      state?: {
        name?: string;
        stateCode?: string;
      };
    }>;
  };
};

type TicketmasterApiResponse = {
  _embedded?: {
    events?: TicketmasterApiEvent[];
  };
};

export async function searchUpcomingShows({
  artist,
  city,
}: TicketmasterSearchParams = {}) {
  const apiKey = process.env.EXPO_PUBLIC_TICKETMASTER_API_KEY;

  if (!apiKey) {
    throw new Error(
      'Configure a variável EXPO_PUBLIC_TICKETMASTER_API_KEY para buscar eventos.',
    );
  }

  const params = new URLSearchParams({
    apikey: apiKey,
    classificationName: 'music',
    countryCode: 'BR',
    sort: 'date,asc',
    size: '20',
  });

  if (artist?.trim()) {
    params.set('keyword', artist.trim());
  }

  if (city?.trim()) {
    params.set('city', city.trim());
  }

  const response = await fetch(`${TICKETMASTER_API_URL}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Não foi possível consultar os próximos shows.');
  }

  const data = (await response.json()) as TicketmasterApiResponse;
  const events = data._embedded?.events ?? [];

  return events.map((event) => mapTicketmasterEvent(event, city));
}

function mapTicketmasterEvent(
  event: TicketmasterApiEvent,
  searchedCity?: string,
): TicketmasterEvent {
  const venue = event._embedded?.venues?.[0];
  const city = getFirstText(
    venue?.city?.name,
    event.place?.city?.name,
    venue?.state?.name,
    event.place?.state?.name,
    venue?.state?.stateCode,
    event.place?.state?.stateCode,
    searchedCity,
  );

  return {
    id: event.id,
    name: event.name,
    date: event.dates?.start?.localDate ?? '',
    city: city ?? 'Localização não informada',
    venue: venue?.name ?? 'Local não informado',
    image: getBestImage(event.images),
    url: event.url ?? null,
  };
}

function getFirstText(...values: Array<string | undefined>) {
  return values.find((value) => value?.trim())?.trim();
}

function getBestImage(images?: TicketmasterApiEvent['images']) {
  if (!images?.length) {
    return null;
  }

  return [...images].sort((current, next) => (next.width ?? 0) - (current.width ?? 0))[0]
    .url;
}
