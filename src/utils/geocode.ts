const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'WCS-Alumni-Map/1.0 (Illinois WCS)';
const DELAY_MS = 1000;
let lastRequestTime = 0;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function geocode(
  city: string,
  state: string
): Promise<{ lat: number; long: number } | null> {
  const params = new URLSearchParams({
    city,
    state,
    country: 'USA',
    format: 'json',
    limit: '1'
  });

  const waitTime = lastRequestTime + DELAY_MS - Date.now();
  if (waitTime > 0) await sleep(waitTime);
  lastRequestTime = Date.now();

  try {
    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'User-Agent': USER_AGENT }
    });

    if (!response.ok) {
      console.warn(
        'Nominatim request failed for ${city}, ${state}: ${response.status}'
      );
      return null;
    }

    const results = (await response.json()) as { lat: string; lon: string }[];

    if (results.length === 0) return null;
    return {
      lat: Number(results[0].lat),
      long: Number(results[0].lon)
    };
  } catch (error) {
    console.warn('Nominatim request error for ${city}, ${state}:', error);
    return null;
  }
}
