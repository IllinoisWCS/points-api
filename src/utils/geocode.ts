const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'WCS-Alumni-Map/1.0 (Illinois WCS)';

export async function geocode(
    city: string,
    state: string,
): Promise<{ lat: number; long: number } | null> {
  const params = new URLSearchParams({
    city,
    state,
    country: 'USA',
    format: 'json',
    limit: '1'
  });
  try {
    const response = await fetch(`${NOMINATIM_URL}?${params}`, {
      headers: { 'User-Agent': USER_AGENT }
    });

    if (!response.ok) return null;

    const results = (await response.json()) as {lat: string; lon: string }[];

    if (results.length === 0) return null;
    return {
      lat: Number(results[0].lat),
      long: Number(results[0].lon)
    };
  } catch {
    return null;
  }
}